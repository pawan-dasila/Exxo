import { Request, Response } from "express";
import { AsyncHandler } from '../middleware/AsyncHandler.middleware.js';
import {
  updateProfileSchema,
  addressSchema,
  changePasswordSchema,
} from '../validation/user.validation.js';
import { UserService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTPSTATUS } from '../configs/Https.config.js';

export class UserController {
  public static updateProfile = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = updateProfileSchema.parse(req.body);
      
      const user = await UserService.updateProfile(
        req.user!.userId,
        validatedData,
        req.file
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Profile updated successfully",
        data: user,
      });
    },
  );

  public static getProfile = AsyncHandler(
    async (req: Request, res: Response) => {
      const user = await UserService.getProfile(req.user!.userId);

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Profile retrieved successfully",
        data: user,
      });
    },
  );

  public static changePassword = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = changePasswordSchema.parse(req.body);
      const result = await UserService.changePassword(
        req.user!.userId,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: result.message,
        data: null,
      });
    },
  );

  // ADDRESS MANAGEMENT
  public static addAddress = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = addressSchema.parse(req.body);
      const address = await UserService.addAddress(
        req.user!.userId,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.CREATED,
        message: "Address added successfully",
        data: address,
      });
    },
  );

  public static getAddresses = AsyncHandler(
    async (req: Request, res: Response) => {
      const addresses = await UserService.getAddresses(req.user!.userId);

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Addresses retrieved successfully",
        data: addresses,
      });
    },
  );

  public static updateAddress = AsyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const validatedData = addressSchema.partial().parse(req.body);

      const address = await UserService.updateAddress(
        req.user!.userId,
        id as string,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Address updated successfully",
        data: address,
      });
    },
  );

  public static deleteAddress = AsyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      await UserService.deleteAddress(req.user!.userId, id as string);

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Address deleted successfully",
      });
    },
  );
}
