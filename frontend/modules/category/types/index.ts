import { ApiResponse, ApiError } from "@/lib/types/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
  imageUrl?: string | null;
  subCategories?: Category[];
  _count?: {
    products: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  parentCategoryId?: string | null;
  imageUrl?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  parentCategoryId?: string | null;
  imageUrl?: string | null;
}

export type { ApiResponse, ApiError };
