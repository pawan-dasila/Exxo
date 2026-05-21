import { Request, Response } from "express";
import { AsyncHandler } from '../middleware/AsyncHandler.middleware.js';
import { AvailabilityService } from '../services/availability.service.js';
import { checkAvailabilitySchema } from '../validation/availability.validation.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTPSTATUS } from '../configs/Https.config.js';

export class AvailabilityController {
  public static checkAvailability = AsyncHandler(
    async (req: Request, res: Response) => {
      const { id: productId } = req.params;
      const validatedData = checkAvailabilitySchema.parse(req.query);

      const isAvailable = await AvailabilityService.checkAvailability(
        productId as string,
        new Date(validatedData.startDate),
        new Date(validatedData.endDate),
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: isAvailable ? "Dates are available" : "Dates are unavailable",
        data: { isAvailable },
      });
    },
  );

  public static getBlockedRanges = AsyncHandler(
    async (req: Request, res: Response) => {
      const { id: productId } = req.params;
      const ranges = await AvailabilityService.getBlockedRanges(
        productId as string,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Blocked and rented ranges retrieved successfully",
        data: ranges,
      });
    },
  );

  public static blockDates = AsyncHandler(
    async (req: Request, res: Response) => {
      const { id: productId } = req.params;
      const validatedData = checkAvailabilitySchema.parse(req.body);

      const block = await AvailabilityService.blockAvailability(
        productId as string,
        req.user!.userId,
        new Date(validatedData.startDate),
        new Date(validatedData.endDate),
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.CREATED,
        message: "Dates blocked successfully",
        data: block,
      });
    },
  );

  public static unblockDates = AsyncHandler(
    async (req: Request, res: Response) => {
      const { blockId } = req.params;

      await AvailabilityService.unblockAvailability(
        blockId as string,
        req.user!.userId,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Dates unblocked successfully",
        data: null,
      });
    },
  );
}
