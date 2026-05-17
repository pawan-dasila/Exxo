import { Request, Response } from "express";
import { AsyncHandler } from "../middleware/AsyncHandler.middleware";
import { RentalService } from "../services/rental.service";
import { ApiResponse } from "../utils/ApiResponse";
import prisma from "../lib/prisma";
import { HTTPSTATUS } from "../configs/Https.config";
import { createRentalOrderSchema } from "../validation/rental.validation";

export class RentalController {
  public static createRentalOrder = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = createRentalOrderSchema.parse(req.body);
      const result = await RentalService.createRentalOrder(
        req.user!.userId,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.CREATED,
        message: "Booking initiated successfully",
        data: result,
      });
    },
  );

  public static getMyOrders = AsyncHandler(
    async (req: Request, res: Response) => {
      // Basic implementation for now
      const orders = await prisma.rentalOrder.findMany({
        where: { borrowerId: req.user!.userId },
        include: {
          items: { include: { product: true } },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Orders retrieved successfully",
        data: orders,
      });
    },
  );

  public static updateOrderStatus = AsyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { status } = req.body;

      const order = await RentalService.updateOrderStatus(
        req.user!.userId,
        id as string,
        status,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: `Order updated to ${status}`,
        data: order,
      });
    },
  );
}
