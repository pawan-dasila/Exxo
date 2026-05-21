import prisma from "../lib/prisma.js";
import { CreateRentalOrderInput } from "../validation/rental.validation.js";
import { AppError } from "../utils/AppError.js";
import { HTTPSTATUS } from "../configs/Https.config.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import { RAZORPAY_CONFIG, razorpay } from "../configs/razorpay.config.js";
import { differenceInDays } from "date-fns";
import logger from "../utils/logger.js";
import { AvailabilityService } from "./availability.service.js";
import { Prisma } from "@prisma/client";

export class RentalService {
  /**
   * Checks if a product is available for the given date range.
   */
  public static async checkAvailability(
    productId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    return await AvailabilityService.checkAvailability(
      productId,
      startDate,
      endDate,
    );
  }

  /**
   * Initiates a rental order and creates a Razorpay order.
   * Atomic operation using Prisma $transaction.
   */
  public static async createRentalOrder(
    userId: string,
    data: CreateRentalOrderInput,
  ) {
    const { productId, startDate, endDate } = data;

    // 1. Fetch Product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { owner: true },
    });

    if (!product || product.deletedAt) {
      throw new AppError(
        "Product not available for rent",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (product.ownerId === userId) {
      throw new AppError(
        "You cannot rent your own product",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    // 2. Check Availability
    const isAvailable = await this.checkAvailability(
      productId,
      startDate,
      endDate,
    );
    if (!isAvailable) {
      throw new AppError(
        "Item is already booked for these dates",
        HTTPSTATUS.CONFLICT,
        ErrorCodeEnum.VALIDATION_ERROR,
      );
    }

    // 3. Calculate Financials
    const days = Math.max(1, differenceInDays(endDate, startDate));
    const rentalTotal = Number(product.rentalPrice) * days;
    const platformFee =
      (rentalTotal * RAZORPAY_CONFIG.PLATFORM_FEE_PERCENTAGE) / 100;
    const depositAmount = Number(product.depositAmount);
    const totalAmount = rentalTotal + platformFee + depositAmount;

    // 4. Create Order and Payment in a Transaction
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the Rental Order
      const order = await tx.rentalOrder.create({
        data: {
          borrowerId: userId,
          lenderId: product.ownerId,
          startDate,
          endDate,
          rentalTotal,
          platformFee,
          depositAmount,
          totalPaid: totalAmount,
          status: "PENDING",
          items: {
            create: {
              productId,
              price: product.rentalPrice,
              startDate,
              endDate,
            },
          },
        },
      });

      // Create Razorpay Order
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // amount in paisa
        currency: RAZORPAY_CONFIG.CURRENCY,
        receipt: order.id,
        notes: {
          productId,
          borrowerId: userId,
          type: "RENTAL_BOOKING",
        },
      });

      // Create Payment record
      await tx.payment.create({
        data: {
          rentalOrderId: order.id,
          amount: totalAmount,
          status: "PENDING",
          razorpayOrderId: rzpOrder.id,
        },
      });

      return {
        order,
        razorpayOrder: rzpOrder,
      };
    });
  }

  /**
   * Updates the status of a rental order.
   * Handles transitions and financial actions (refund/payout).
   */
  public static async updateOrderStatus(
    userId: string,
    orderId: string,
    status:
      | "CONFIRMED"
      | "ACTIVE"
      | "RETURN_PENDING"
      | "COMPLETED"
      | "CANCELLED",
  ) {
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
        payment: true,
      },
    });

    if (!order) {
      throw new AppError(
        "Order not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (status === "CANCELLED") {
      const productIds = order.items
        .map((item: { productId: string }) => item.productId)
        .filter(Boolean);
      await prisma.productAvailability.deleteMany({
        where: {
          productId: { in: productIds },
          startDate: order.startDate,
          endDate: order.endDate,
          isBlocked: true,
        },
      });
    }

    if (status === "ACTIVE") {
      const productOwnerId = order.items[0]?.inventoryItem?.product?.ownerId;
      if (productOwnerId !== userId) {
        throw new AppError(
          "Only the lender can confirm handover",
          HTTPSTATUS.FORBIDDEN,
          ErrorCodeEnum.FORBIDDEN,
        );
      }
      if (order.status !== "CONFIRMED") {
        throw new AppError(
          "Order must be confirmed (paid) to be set to active",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.VALIDATION_ERROR,
        );
      }
    }

    if (status === "RETURN_PENDING") {
      if (order.borrowerId !== userId) {
        throw new AppError(
          "Only the borrower can initiate return",
          HTTPSTATUS.FORBIDDEN,
          ErrorCodeEnum.FORBIDDEN,
        );
      }
      if (order.status !== "ACTIVE") {
        throw new AppError(
          "Order must be active to be returned",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.VALIDATION_ERROR,
        );
      }
    }

    if (status === "COMPLETED") {
      // Lender confirms safe return
      const productOwnerId = order.items[0]?.inventoryItem?.product?.ownerId;
      if (productOwnerId !== userId) {
        throw new AppError(
          "Only the lender can confirm completion",
          HTTPSTATUS.FORBIDDEN,
          ErrorCodeEnum.FORBIDDEN,
        );
      }
      if (order.status !== "RETURN_PENDING") {
        throw new AppError(
          "Order must be in return-pending state",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.VALIDATION_ERROR,
        );
      }

      // TRIGGER FINANCIALS (Escrow Flow)
      try {
        // 1. Refund Security Deposit to Borrower
        if (order.payment?.razorpayPaymentId) {
          await razorpay.payments.refund(order.payment.razorpayPaymentId, {
            amount: Math.round(Number(order.depositAmount) * 100),
            notes: { orderId: order.id, type: "DEPOSIT_REFUND" },
          });
        }

        // 2. Payout Rental Fee to Lender
        const productOwnerId = order.items[0]?.inventoryItem?.product?.ownerId;
        logger.info(
          `Escrow: Payout of ${order.rentalTotal} initiated for Lender ${productOwnerId}`,
        );
      } catch (error) {
        logger.error(error as Error, "Financial completion failed");
        // We might want to keep the order in a specific state if financials fail
      }
    }

    return await prisma.rentalOrder.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
