import prisma from '../lib/prisma.js';
import { Prisma } from "@prisma/client";
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from '../validation/product.validation.js';
import { AppError } from '../utils/AppError.js';
import { HTTPSTATUS } from '../configs/Https.config.js';
import { ErrorCodeEnum } from '../enums/error-code.enum.js';
import { generateSlug } from '../utils/slug.js';

export class ProductService {
  public static async createProduct(userId: string, data: CreateProductInput) {
    const { images, ...rest } = data;
    const slug = `${generateSlug(data.name)}-${Math.random().toString(36).substring(2, 7)}`;

    return await prisma.product.create({
      data: {
        ...rest,
        slug,
        ownerId: userId,
        images: {
          create: images.map((imageUrl) => ({ imageUrl })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  public static async getAllProducts(filters: ProductFilters) {
    const {
      category,
      lat,
      lng,
      radius,
      minPrice,
      maxPrice,
      search,
      page,
      limit,
    } = filters;

    let latMin, latMax, lngMin, lngMax;
    if (lat !== undefined && lng !== undefined) {
      const offset = radius / 111; // simple approx
      latMin = lat - offset;
      latMax = lat + offset;
      lngMin = lng - offset;
      lngMax = lng + offset;
    }

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(minPrice && { rentalPrice: { gte: minPrice } }),
      ...(maxPrice && { rentalPrice: { lte: maxPrice } }),
      ...(latMin !== undefined && {
        latitude: { gte: latMin, lte: latMax },
        longitude: { gte: lngMin, lte: lngMax },
      }),
    };

    const hasPagination = page !== undefined && limit !== undefined;
    const skip = hasPagination ? (page - 1) * limit : undefined;
    const take = hasPagination ? limit : undefined;

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          size: true,
          color: true,
          condition: true,
          rentalPrice: true,
          depositAmount: true,
          retailPrice: true,
          latitude: true,
          longitude: true,
          pickupAddress: true,
          ownerId: true,
          brandId: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          status: true,
          images: {
            select: {
              id: true,
              productId: true,
              imageUrl: true,
              sortOrder: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              avgRating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      hasPagination ? prisma.product.count({ where }) : Promise.resolve(0),
    ]);

    if (hasPagination) {
      const totalPages = Math.ceil(totalItems / limit);
      return {
        products,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
        },
      };
    }

    return {
      products,
      pagination: null,
    };
  }

  public static async getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!product) {
      throw new AppError(
        "Product not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    // Atomically increment viewCount on retrieve, and include all detail page data
    const [updated, reviews] = await Promise.all([
      prisma.product.update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          brand: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              bio: true,
              avgRating: true,
              verificationStatus: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.review.findMany({
        where: { productId: product.id },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    // Compute aggregated rating from reviews
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    return {
      ...updated,
      reviews,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      reviewCount: reviews.length,
    };
  }

  public static async updateProduct(
    productId: string,
    userId: string,
    data: UpdateProductInput,
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.deletedAt) {
      throw new AppError(
        "Product not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (product.ownerId !== userId) {
      throw new AppError(
        "You don't have permission to update this product",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
      );
    }

    // Handle image updates if provided
    if (data.images) {
      // For simplicity in this version, we replace all images
      // A more sophisticated version would diff them
      await prisma.productImage.deleteMany({ where: { productId } });
    }

    const { images, ...rest } = data;

    return await prisma.product.update({
      where: { id: productId },
      data: {
        ...rest,
        images: images
          ? {
              create: images.map((imageUrl) => ({ imageUrl })),
            }
          : undefined,
      },
      include: { images: true },
    });
  }

  public static async deleteProduct(productId: string, userId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(
        "Product not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    if (product.ownerId !== userId) {
      throw new AppError(
        "You don't have permission to delete this product",
        HTTPSTATUS.FORBIDDEN,
        ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
      );
    }

    // Soft delete
    return await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Atomically increment product clickCount.
   */
  public static async clickProduct(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.deletedAt) {
      throw new AppError(
        "Product not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    return await prisma.product.update({
      where: { id: productId },
      data: { clickCount: { increment: 1 } },
    });
  }

  public static async saveSearch(
    userId: string,
    query: string,
    filters?: Record<string, string | number | boolean | undefined | null>,
  ) {
    return await prisma.savedSearch.create({
      data: {
        userId,
        query,
        filters: filters ? (filters as Prisma.InputJsonValue) : Prisma.JsonNull,
        isActive: true,
      },
    });
  }

  /**
   * Fetch all active saved searches for a user.
   */
  public static async getSavedSearches(userId: string) {
    return await prisma.savedSearch.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
