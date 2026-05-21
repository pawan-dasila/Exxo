import prisma from '../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import { HTTPSTATUS } from '../configs/Https.config.js';
import { ErrorCodeEnum } from '../enums/error-code.enum.js';
import {
  RentalInspection,
  DamageReport,
  Dispute,
  InspectionType,
} from "@prisma/client";

export class TrustService {
  /**
   * Record a pre-rental or post-rental condition inspection.
   */
  public static async recordInspection(
    orderId: string,
    inspectorId: string,
    type: InspectionType,
    images: string[],
    notes?: string,
  ): Promise<RentalInspection> {
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

    const lenderId = order.items[0]?.inventoryItem?.product?.ownerId;
    if (order.borrowerId !== inspectorId && lenderId !== inspectorId) {
      throw new AppError(
        "Only the borrower or lender can submit inspections",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    return await prisma.rentalInspection.create({
      data: {
        rentalOrderId: orderId,
        type,
        inspectorId,
        images,
        notes,
      },
    });
  }

  /**
   * Report rental damage, automatically freezing the security deposit hold.
   */
  public static async reportDamage(
    orderId: string,
    reportedById: string,
    description: string,
    images: string[],
    estimatedCost?: number,
  ): Promise<DamageReport> {
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
        "Rental order not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    const lenderId = order.items[0]?.inventoryItem?.product?.ownerId;
    if (order.borrowerId !== reportedById && lenderId !== reportedById) {
      throw new AppError(
        "Only the borrower or lender can report damages",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    // Atomic database action
    return await prisma.$transaction(async (tx) => {
      const report = await tx.damageReport.create({
        data: {
          rentalOrderId: orderId,
          reportedById,
          description,
          images,
          estimatedCost,
        },
      });

      // Freeze security deposit status to HELD immediately if payment exists
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            depositStatus: "HELD",
          },
        });
      }

      return report;
    });
  }

  /**
   * Open a official dispute on a rental order to resolve deposit/damage claims.
   */
  public static async openDispute(
    orderId: string,
    openedById: string,
    reason: string,
  ): Promise<Dispute> {
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
        "Rental order not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    const lenderId = order.items[0]?.inventoryItem?.product?.ownerId;
    if (order.borrowerId !== openedById && lenderId !== openedById) {
      throw new AppError(
        "Only the borrower or lender can open a dispute",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.FORBIDDEN,
      );
    }

    return await prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.create({
        data: {
          rentalOrderId: orderId,
          openedById,
          reason,
          status: "OPEN",
        },
      });

      // Keep / set deposit status to HELD during dispute
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            depositStatus: "HELD",
          },
        });
      }

      return dispute;
    });
  }

  /**
   * Get all trust logs/records for a specific order.
   */
  public static async getTrustRecordsForOrder(orderId: string) {
    const inspections = await prisma.rentalInspection.findMany({
      where: { rentalOrderId: orderId },
      orderBy: { createdAt: "desc" },
    });

    const damageReports = await prisma.damageReport.findMany({
      where: { rentalOrderId: orderId },
      orderBy: { createdAt: "desc" },
    });

    const disputes = await prisma.dispute.findMany({
      where: { rentalOrderId: orderId },
      orderBy: { createdAt: "desc" },
    });

    return {
      inspections,
      damageReports,
      disputes,
    };
  }
}
