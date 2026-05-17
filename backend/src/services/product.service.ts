import prisma from "../lib/prisma";
import { CreateProductInput, UpdateProductInput, ProductFilters } from "../validation/product.validation";
import { AppError } from "../utils/AppError";
import { HTTPSTATUS } from "../configs/Https.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { generateSlug } from "../utils/slug";

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
    const { category, lat, lng, radius, minPrice, maxPrice, search } = filters;

    // Basic Bounding Box for Hyperlocal (Approximate: 1 degree ~ 111km)
    let latMin, latMax, lngMin, lngMax;
    if (lat !== undefined && lng !== undefined) {
      const offset = radius / 111; // simple approx
      latMin = lat - offset;
      latMax = lat + offset;
      lngMin = lng - offset;
      lngMax = lng + offset;
    }

    return await prisma.product.findMany({
      where: {
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
      },
      include: {
        images: true,
        category: true,
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
    });
  }

  public static async getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: {
        images: true,
        category: true,
        brand: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            avgRating: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError(
        "Product not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND
      );
    }

    return product;
  }

  public static async updateProduct(productId: string, userId: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.deletedAt) {
      throw new AppError("Product not found", HTTPSTATUS.NOT_FOUND, ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }

    if (product.ownerId !== userId) {
      throw new AppError("You don't have permission to update this product", HTTPSTATUS.FORBIDDEN, ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS);
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
        images: images ? {
          create: images.map(imageUrl => ({ imageUrl }))
        } : undefined
      },
      include: { images: true }
    });
  }

  public static async deleteProduct(productId: string, userId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Product not found", HTTPSTATUS.NOT_FOUND, ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }

    if (product.ownerId !== userId) {
      throw new AppError("You don't have permission to delete this product", HTTPSTATUS.FORBIDDEN, ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS);
    }

    // Soft delete
    return await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });
  }
}
