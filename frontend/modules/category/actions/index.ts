import { axiosInstance } from "@/hooks/use-axios";
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  ApiResponse,
} from "../types";

export const categoryApi = {
  /**
   * Fetch all categories (nested tree format)
   */
  async getAll(): Promise<Category[]> {
    const response =
      await axiosInstance.get<ApiResponse<Category[]>>("/categories");
    return response.data.data;
  },

  /**
   * Fetch a single category by its slug
   */
  async getBySlug(slug: string): Promise<Category> {
    const response = await axiosInstance.get<ApiResponse<Category>>(
      `/categories/${slug}`,
    );
    return response.data.data;
  },

  /**
   * Create a new category (Admin only)
   */
  async create(data: CreateCategoryInput): Promise<Category> {
    const response = await axiosInstance.post<ApiResponse<Category>>(
      "/categories",
      data,
    );
    return response.data.data;
  },

  /**
   * Update an existing category (Admin only)
   */
  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const response = await axiosInstance.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      data,
    );
    return response.data.data;
  },

  /**
   * Delete a category (Admin only)
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};

/**
 * Server Component Action wrapper for category fetching
 */
export async function getCategoryBySlugAction(slug: string): Promise<Category> {
  return await categoryApi.getBySlug(slug);
}
