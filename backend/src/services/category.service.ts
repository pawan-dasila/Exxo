import prisma from "../lib/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "../validation/category.validation";
import { AppError } from "../utils/AppError";
import { HTTPSTATUS } from "../configs/Https.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { generateSlug } from "../utils/slug";

export class CategoryService {
  public static async createCategory(data: CreateCategoryInput) {
    const slug = generateSlug(data.name);

    // Check if category with same slug exists
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new AppError(
        "Category with this name already exists",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    return await prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  public static async getAllCategories() {
    // Return top-level categories with their nested sub-categories
    return await prisma.category.findMany({
      where: { parentCategoryId: null },
      include: {
        subCategories: {
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  public static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new AppError(
        "Category not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND
      );
    }

    return category;
  }

  public static async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new AppError(
        "Category not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND
      );
    }

    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      slug = generateSlug(data.name);
      
      // Check for slug collision
      const collision = await prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });

      if (collision) {
        throw new AppError(
          "Category with this name already exists",
          HTTPSTATUS.BAD_REQUEST,
          ErrorCodeEnum.VALIDATION_ERROR
        );
      }
    }

    return await prisma.category.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
  }

  public static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            products: true,
            subCategories: true 
          },
        },
      },
    });

    if (!category) {
      throw new AppError(
        "Category not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND
      );
    }

    if (category._count.products > 0) {
      throw new AppError(
        "Cannot delete category that has products",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    if (category._count.subCategories > 0) {
      throw new AppError(
        "Cannot delete category that has sub-categories. Please delete or move sub-categories first.",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    return await prisma.category.delete({
      where: { id },
    });
  }
}
