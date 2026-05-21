import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { HTTPSTATUS } from "../configs/Https.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { isBefore } from "date-fns";

export class AvailabilityService {
  /**
   * Checks if a product is fully available (not overlapping with blocks or active orders)
   */
  public static async checkAvailability(
    productId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    if (isBefore(startDate, new Date())) {
      throw new AppError(
        "Start date cannot be in the past",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    if (isBefore(endDate, startDate)) {
      throw new AppError(
        "End date must be after start date",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    // 1. Check ProductAvailability model blocks
    const overlappingBlock = await prisma.productAvailability.findFirst({
      where: {
        productId,
        isBlocked: true,
        OR: [
          {
            startDate: { lte: startDate },
            endDate: { gte: startDate },
          },
          {
            startDate: { lte: endDate },
            endDate: { gte: endDate },
          },
          {
            startDate: { gte: startDate },
            endDate: { lte: endDate },
          },
        ],
      },
    });

    if (overlappingBlock) {
      return false;
    }

    // 2. Check active/pending RentalOrders
    const overlappingOrder = await prisma.rentalOrder.findFirst({
      where: {
        items: {
          some: { productId },
        },
        status: {
          in: ["PENDING", "CONFIRMED", "ACTIVE", "RETURN_PENDING"],
        },
        OR: [
          {
            startDate: { lte: startDate },
            endDate: { gte: startDate },
          },
          {
            startDate: { lte: endDate },
            endDate: { gte: endDate },
          },
          {
            startDate: { gte: startDate },
            endDate: { lte: endDate },
          },
        ],
      },
    });

    return !overlappingOrder;
  }

  /**
   * Blocks availability for a specific product manually (usually a lender action)
   */
  public static async blockAvailability(
    productId: string,
    lenderId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(
        "Product not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (product.ownerId !== lenderId) {
      throw new AppError(
        "Only the product owner can block availability",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    const isAvailable = await this.checkAvailability(
      productId,
      startDate,
      endDate,
    );
    if (!isAvailable) {
      throw new AppError(
        "Cannot block dates: dates overlap with an existing booking or block",
        HTTPSTATUS.CONFLICT,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    return await prisma.productAvailability.create({
      data: {
        productId,
        startDate,
        endDate,
        isBlocked: true,
      },
    });
  }

  /**
   * Removes a manual block (lender action)
   */
  public static async unblockAvailability(
    blockId: string,
    lenderId: string,
  ): Promise<void> {
    const block = await prisma.productAvailability.findUnique({
      where: { id: blockId },
      include: { product: true },
    });

    if (!block) {
      throw new AppError(
        "Availability block not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (block.product.ownerId !== lenderId) {
      throw new AppError(
        "Only the product owner can unblock availability",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    await prisma.productAvailability.delete({
      where: { id: blockId },
    });
  }

  /**
   * Retrieves all blocked and rented ranges for a product
   */
  public static async getBlockedRanges(productId: string) {
    const blocks = await prisma.productAvailability.findMany({
      where: { productId, isBlocked: true },
      select: { id: true, startDate: true, endDate: true },
    });

    const rentedOrders = await prisma.rentalOrder.findMany({
      where: {
        items: { some: { productId } },
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE", "RETURN_PENDING"] },
      },
      select: { startDate: true, endDate: true },
    });

    return {
      manualBlocks: blocks,
      rentedRanges: rentedOrders,
    };
  }
}
