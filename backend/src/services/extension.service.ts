import prisma from '../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import { HTTPSTATUS } from '../configs/Https.config.js';
import { ErrorCodeEnum } from '../enums/error-code.enum.js';
import { AvailabilityService } from './availability.service.js';
import { differenceInDays, isAfter } from "date-fns";
import { RentalExtensionRequest } from "@prisma/client";

export class ExtensionService {
  /**
   * Request a rental extension as a borrower.
   */
  public static async requestExtension(
    orderId: string,
    borrowerId: string,
    requestedEndDate: Date,
  ): Promise<RentalExtensionRequest> {
    const order = await prisma.rentalOrder.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            inventoryItem: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError(
        "Rental order not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (order.borrowerId !== borrowerId) {
      throw new AppError(
        "Only the borrower can request an extension",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    if (order.status !== "ACTIVE" && order.status !== "CONFIRMED") {
      throw new AppError(
        "Extensions can only be requested for active or confirmed orders",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    // Verify proposed date is after current end date
    const currentEnd = new Date(order.endDate);
    const proposedEnd = new Date(requestedEndDate);
    if (!isAfter(proposedEnd, currentEnd)) {
      throw new AppError(
        "Requested end date must be after the current end date",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    // Check availability for extended period (from currentEnd to proposedEnd)
    for (const item of order.items) {
      const isAvailable = await AvailabilityService.checkAvailability(
        item.productId,
        currentEnd,
        proposedEnd,
      );
      if (!isAvailable) {
        throw new AppError(
          "Product has date conflicts during the proposed extension range",
          HTTPSTATUS.CONFLICT,
          ErrorCodeEnum.RESOURCE_ALREADY_EXISTS,
        );
      }
    }

    // Calculate additional price based on original daily snapshot rate
    const additionalDays = Math.max(
      1,
      differenceInDays(proposedEnd, currentEnd),
    );
    const pricePerDay = order.items[0]?.price || 0;
    const additionalAmount = pricePerDay * additionalDays;

    return await prisma.rentalExtensionRequest.create({
      data: {
        rentalOrderId: orderId,
        requestedById: borrowerId,
        currentEndDate: currentEnd,
        requestedEndDate: proposedEnd,
        additionalAmount,
        status: "PENDING",
      },
    });
  }

  /**
   * Approve a rental extension request as a lender.
   */
  public static async approveExtension(
    requestId: string,
    lenderId: string,
  ): Promise<RentalExtensionRequest> {
    return await prisma.$transaction(async (tx) => {
      const request = await tx.rentalExtensionRequest.findUnique({
        where: { id: requestId },
        include: {
          order: {
            include: {
              items: {
                include: {
                  inventoryItem: {
                    include: { product: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!request) {
        throw new AppError(
          "Extension request not found",
          HTTPSTATUS.NOT_FOUND,
          ErrorCodeEnum.RESOURCE_NOT_FOUND,
        );
      }

      if (request.status !== "PENDING") {
        throw new AppError(
          "Only pending requests can be approved",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.VALIDATION_ERROR,
        );
      }

      // Find original product owner (lender)
      const productOwnerId =
        request.order.items[0]?.inventoryItem?.product?.ownerId;
      if (productOwnerId !== lenderId) {
        throw new AppError(
          "Only the lender can approve extension requests",
          HTTPSTATUS.FORBIDDEN,
          ErrorCodeEnum.FORBIDDEN,
        );
      }

      // Check availability again within transaction to prevent race conditions
      for (const item of request.order.items) {
        // Double check blocks
        const overlappingBlock = await tx.productAvailability.findFirst({
          where: {
            productId: item.productId,
            isBlocked: true,
            OR: [
              {
                startDate: { lte: request.currentEndDate },
                endDate: { gte: request.currentEndDate },
              },
              {
                startDate: { lte: request.requestedEndDate },
                endDate: { gte: request.requestedEndDate },
              },
              {
                startDate: { gte: request.currentEndDate },
                endDate: { lte: request.requestedEndDate },
              },
            ],
          },
        });

        if (overlappingBlock) {
          throw new AppError(
            "The item has conflict dates in the extension period",
            HTTPSTATUS.CONFLICT,
            ErrorCodeEnum.RESOURCE_ALREADY_EXISTS,
          );
        }
      }

      // Update extension request status
      const updatedRequest = await tx.rentalExtensionRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      });

      // Prolong original rental order dates and update totals
      await tx.rentalOrder.update({
        where: { id: request.rentalOrderId },
        data: {
          endDate: request.requestedEndDate,
          rentalTotal: { increment: request.additionalAmount },
          totalPaid: { increment: request.additionalAmount },
        },
      });

      // Book dates in ProductAvailability
      for (const item of request.order.items) {
        await tx.productAvailability.create({
          data: {
            productId: item.productId,
            startDate: request.currentEndDate,
            endDate: request.requestedEndDate,
            isBlocked: true,
          },
        });
      }

      return updatedRequest;
    });
  }

  /**
   * Reject a rental extension request as a lender.
   */
  public static async rejectExtension(
    requestId: string,
    lenderId: string,
  ): Promise<RentalExtensionRequest> {
    const request = await prisma.rentalExtensionRequest.findUnique({
      where: { id: requestId },
      include: {
        order: {
          include: {
            items: {
              include: {
                inventoryItem: {
                  include: { product: true },
                },
              },
            },
          },
        },
      },
    });

    if (!request) {
      throw new AppError(
        "Extension request not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (request.status !== "PENDING") {
      throw new AppError(
        "Only pending requests can be rejected",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    const productOwnerId =
      request.order.items[0]?.inventoryItem?.product?.ownerId;
    if (productOwnerId !== lenderId) {
      throw new AppError(
        "Only the lender can reject extension requests",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    return await prisma.rentalExtensionRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
  }

  /**
   * Fetch all extension requests for a specific order.
   */
  public static async getExtensionRequestsByOrder(
    orderId: string,
  ): Promise<RentalExtensionRequest[]> {
    return await prisma.rentalExtensionRequest.findMany({
      where: { rentalOrderId: orderId },
      orderBy: { createdAt: "desc" },
    });
  }
}
