import { Request, Response } from "express";
import { AsyncHandler } from '../middleware/AsyncHandler.middleware.js';
import { CategoryService } from '../services/category.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTPSTATUS } from '../configs/Https.config.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validation/category.validation.js';

export class CategoryController {
  public static createCategory = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await CategoryService.createCategory(validatedData);

      return ApiResponse(res, {
        status_code: HTTPSTATUS.CREATED,
        message: "Category created successfully",
        data: category,
      });
    },
  );

  public static getAllCategories = AsyncHandler(
    async (req: Request, res: Response) => {
      const categories = await CategoryService.getAllCategories();
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Categories retrieved successfully",
        data: categories,
      });
    },
  );

  public static getCategoryBySlug = AsyncHandler(
    async (req: Request, res: Response) => {
      const category = await CategoryService.getCategoryBySlug(
        req.params.slug as string,
      );
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Category retrieved successfully",
        data: category,
      });
    },
  );

  public static updateCategory = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await CategoryService.updateCategory(
        req.params.id as string,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Category updated successfully",
        data: category,
      });
    },
  );

  public static deleteCategory = AsyncHandler(
    async (req: Request, res: Response) => {
      await CategoryService.deleteCategory(req.params.id as string);
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Category deleted successfully",
        data: null,
      });
    },
  );
}
