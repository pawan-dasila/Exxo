import { Request, Response } from "express";
import { AsyncHandler } from '../middleware/AsyncHandler.middleware.js';
import { ExtensionService } from '../services/extension.service.js';
import { extensionRequestSchema } from '../validation/extension.validation.js';
import { HTTPSTATUS } from '../configs/Https.config.js';

export class ExtensionController {
  /**
   * Request a rental extension.
   */
  public static requestExtension = AsyncHandler(
    async (req: Request, res: Response) => {
      const orderId = req.params.orderId as string;
      const body = extensionRequestSchema.parse(req.body);
      const userId = req.user?.userId as string;

      const request = await ExtensionService.requestExtension(
        orderId,
        userId,
        new Date(body.newEndDate),
      );

      return res.status(HTTPSTATUS.CREATED).json({
        message: "Extension request submitted successfully",
        data: request,
      });
    },
  );

  /**
   * Approve a rental extension.
   */
  public static approveExtension = AsyncHandler(
    async (req: Request, res: Response) => {
      const requestId = req.params.requestId as string;
      const userId = req.user?.userId as string;

      const request = await ExtensionService.approveExtension(
        requestId,
        userId,
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Extension request approved successfully",
        data: request,
      });
    },
  );

  /**
   * Reject a rental extension.
   */
  public static rejectExtension = AsyncHandler(
    async (req: Request, res: Response) => {
      const requestId = req.params.requestId as string;
      const userId = req.user?.userId as string;

      const request = await ExtensionService.rejectExtension(requestId, userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Extension request rejected successfully",
        data: request,
      });
    },
  );

  /**
   * Get all extension requests for a specific order.
   */
  public static getExtensionsByOrder = AsyncHandler(
    async (req: Request, res: Response) => {
      const orderId = req.params.orderId as string;

      const requests =
        await ExtensionService.getExtensionRequestsByOrder(orderId);

      return res.status(HTTPSTATUS.OK).json({
        data: requests,
      });
    },
  );
}
