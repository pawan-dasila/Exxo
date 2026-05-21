import crypto from "crypto";
import { Env } from "../configs/env.config";
import prisma from "../lib/prisma";
import logger from "../utils/logger";

interface RazorpayWebhookPayload {
  payment: {
    entity: {
      order_id: string;
      id: string;
      amount: number;
      currency: string;
      status: string;
    };
  };
}

export class PaymentService {
  /**
   * Verifies the Razorpay webhook signature.
   */
  public static verifySignature(rawBody: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", Env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Handles payment success event.
   */
  public static async handlePaymentSuccess(
    payload: RazorpayWebhookPayload,
  ): Promise<void> {
    const { order_id: rzpOrderId, id: rzpPaymentId } = payload.payment.entity;

    // Use a transaction to ensure atomic updates
    await prisma.$transaction(async (tx) => {
      // 1. Find the payment record
      const payment = await tx.payment.findUnique({
        where: { razorpayOrderId: rzpOrderId },
      });

      if (!payment) {
        logger.error(
          `Payment record not found for Razorpay Order ID: ${rzpOrderId}`,
        );
        return;
      }

      if (payment.status === "SUCCESS") {
        logger.info(`Payment ${payment.id} already processed`);
        return;
      }

      // 2. Update Payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: rzpPaymentId,
        },
      });

      // 3. Update RentalOrder status to CONFIRMED
      const updatedOrder = await tx.rentalOrder.update({
        where: { id: payment.rentalOrderId },
        data: {
          status: "CONFIRMED",
        },
        include: {
          items: true,
        },
      });

      // 4. Record blocked dates in ProductAvailability automatically
      for (const item of updatedOrder.items) {
        await tx.productAvailability.create({
          data: {
            productId: item.productId,
            startDate: updatedOrder.startDate,
            endDate: updatedOrder.endDate,
            isBlocked: true,
          },
        });
      }

      logger.info(
        `Order ${payment.rentalOrderId} confirmed and dates blocked via payment ${rzpPaymentId}`,
      );
    });
  }

  /**
   * Handles payment failure event.
   */
  public static async handlePaymentFailure(
    payload: RazorpayWebhookPayload,
  ): Promise<void> {
    const { order_id: rzpOrderId } = payload.payment.entity;

    await prisma.payment.update({
      where: { razorpayOrderId: rzpOrderId },
      data: {
        status: "FAILED",
      },
    });

    // Optionally update rental order status or leave as PENDING for retry
    // For now, we'll keep it simple
  }
}
