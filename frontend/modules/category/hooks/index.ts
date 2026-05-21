import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../actions";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";
import { logger } from "@/lib/utils";

// Query keys constants
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const,
};

/**
 * Hook to fetch all categories with nested subcategories.
 */
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      try {
        return await categoryApi.getAll();
      } catch (error) {
        logger.error("Failed to fetch categories list", error, {
          module: "useCategories",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook to fetch a specific category by slug.
 */
export const useCategoryBySlug = (slug: string) => {
  return useQuery<Category, Error>({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      try {
        return await categoryApi.getBySlug(slug);
      } catch (error) {
        logger.error(`Failed to fetch category by slug: ${slug}`, error, {
          module: "useCategoryBySlug",
        });
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

/**
 * Hook to create a category (Admin only).
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryInput>({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      // Invalidate category list queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      logger.error("Error creating category", error, {
        module: "useCreateCategory",
      });
    },
  });
};

/**
 * Hook to update a category (Admin only).
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    Error,
    { id: string; data: UpdateCategoryInput }
  >({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: (data) => {
      // Invalidate both category lists and detail queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(data.slug),
      });
    },
    onError: (error) => {
      logger.error("Error updating category", error, {
        module: "useUpdateCategory",
      });
    },
  });
};

/**
 * Hook to delete a category (Admin only).
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      logger.error("Error deleting category", error, {
        module: "useDeleteCategory",
      });
    },
  });
};
