import { Request, Response } from "express";
import { AsyncHandler } from "../middleware/AsyncHandler.middleware";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTPSTATUS } from "../configs/Https.config";
import {
  createProductSchema,
  updateProductSchema,
  productFilterSchema,
} from "../validation/product.validation";

export class ProductController {
  public static createProduct = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = createProductSchema.parse(req.body);
      const product = await ProductService.createProduct(
        req.user!.userId,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.CREATED,
        message: "Product listed successfully",
        data: product,
      });
    },
  );

  public static getAllProducts = AsyncHandler(
    async (req: Request, res: Response) => {
      const filters = productFilterSchema.parse(req.query);
      const products = await ProductService.getAllProducts(filters);

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Products retrieved successfully",
        data: products,
      });
    },
  );

  public static getProductBySlug = AsyncHandler(
    async (req: Request, res: Response) => {
      const product = await ProductService.getProductBySlug(
        req.params.slug as string,
      );
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Product retrieved successfully",
        data: product,
      });
    },
  );

  public static updateProduct = AsyncHandler(
    async (req: Request, res: Response) => {
      const validatedData = updateProductSchema.parse(req.body);
      const product = await ProductService.updateProduct(
        req.params.id as string,
        req.user!.userId,
        validatedData,
      );

      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Product updated successfully",
        data: product,
      });
    },
  );

  public static deleteProduct = AsyncHandler(
    async (req: Request, res: Response) => {
      await ProductService.deleteProduct(
        req.params.id as string,
        req.user!.userId,
      );
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Product deleted successfully",
        data: null,
      });
    },
  );

  public static clickProduct = AsyncHandler(
    async (req: Request, res: Response) => {
      const product = await ProductService.clickProduct(
        req.params.id as string,
      );
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Click tracked successfully",
        data: { clickCount: product.clickCount },
      });
    },
  );

  public static saveSearch = AsyncHandler(
    async (req: Request, res: Response) => {
      const { query, filters } = req.body;
      const savedSearch = await ProductService.saveSearch(
        req.user!.userId,
        query as string,
        filters as Record<string, string | number | boolean | undefined | null>,
      );
      return ApiResponse(res, {
        status_code: HTTPSTATUS.CREATED,
        message: "Search saved successfully",
        data: savedSearch,
      });
    },
  );

  public static getSavedSearches = AsyncHandler(
    async (req: Request, res: Response) => {
      const searches = await ProductService.getSavedSearches(req.user!.userId);
      return ApiResponse(res, {
        status_code: HTTPSTATUS.OK,
        message: "Saved searches retrieved successfully",
        data: searches,
      });
    },
  );
}
