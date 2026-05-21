import { Request, Response } from "express";
import { AsyncHandler } from "../middleware/AsyncHandler.middleware";
import { TrustService } from "../services/trust.service";
import { inspectionSchema, damageReportSchema, disputeSchema } from "../validation/trust.validation";
import { HTTPSTATUS } from "../configs/Https.config";

export class TrustController {
  /**
   * Record a condition inspection.
   */
  public static recordInspection = AsyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const body = inspectionSchema.parse(req.body);
    const userId = req.user?.userId as string;

    const inspection = await TrustService.recordInspection(
      orderId,
      userId,
      body.type,
      body.images
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Inspection recorded successfully",
      data: inspection,
    });
  });

  /**
   * Report damage on a rental order.
   */
  public static reportDamage = AsyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const body = damageReportSchema.parse(req.body);
    const userId = req.user?.userId as string;

    const report = await TrustService.reportDamage(
      orderId,
      userId,
      body.description,
      body.images,
      body.estimatedCost
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Damage report submitted successfully. Escrow security deposit locked.",
      data: report,
    });
  });

  /**
   * Open a dispute on a rental order.
   */
  public static openDispute = AsyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const body = disputeSchema.parse(req.body);
    const userId = req.user?.userId as string;

    // Concatenate title and description to fit DB reason field
    const combinedReason = `Title: ${body.title}\nDescription: ${body.description}`;

    const dispute = await TrustService.openDispute(
      orderId,
      userId,
      combinedReason
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dispute opened successfully. Escrow security deposit locked.",
      data: dispute,
    });
  });

  /**
   * Get all trust logs and records for a rental order.
   */
  public static getTrustRecords = AsyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;

    const records = await TrustService.getTrustRecordsForOrder(orderId);

    return res.status(HTTPSTATUS.OK).json({
      data: records,
    });
  });
}
