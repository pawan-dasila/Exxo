import { axiosInstance } from "@/hooks/use-axios";
import { Product, ProductFilters } from "../types";
import { ApiResponse } from "@/lib/types/api";

interface PaginatedProductsResponse {
  products: Product[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
}

export async function getProductsAction(filters?: ProductFilters): Promise<Product[]> {
  const response = await axiosInstance.get<ApiResponse<PaginatedProductsResponse>>("/products", {
    params: filters,
  });
  return response.data.data?.products || [];
}

export async function getProductsByCategoryAction(categorySlug: string): Promise<Product[]> {
  return await getProductsAction({ category: categorySlug });
}

export async function searchProductsAction(query: string): Promise<Product[]> {
  return await getProductsAction({ search: query });
}

export async function getProductBySlugAction(slug: string): Promise<Product | null> {
  try {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch product by slug ${slug}`, error);
    return null;
  }
}

export async function getTrendingProductsAction(): Promise<Product[]> {
  try {
    const response = await axiosInstance.get<ApiResponse<Product[]>>("/products");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch trending products", error);
    return [];
  }
}
