export type ProductStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "BLOCKED" | "ARCHIVED";
export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  sortOrder?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export interface ReviewAuthor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export interface Review {
  id: string;
  authorId: string;
  productId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: ReviewAuthor;
}

export interface ProductOwner {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  bio?: string | null;
  avgRating: number;
  verificationStatus: VerificationStatus;
  createdAt?: string;
}

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface ProductSpecifications {
  specs: ProductSpecItem[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  size?: string | null;
  color?: string | null;
  condition?: string | null;
  status?: ProductStatus;
  rentalPrice: number;
  depositAmount: number;
  retailPrice?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  pickupAddress?: string | null;
  specifications?: ProductSpecifications | null;
  ownerId: string;
  brandId?: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Relations
  images?: ProductImage[];
  category?: Category;
  brand?: Brand | null;
  owner?: ProductOwner | null;
  reviews?: Review[];
  avgRating?: number | null;
  reviewCount?: number;
}

export interface ProductFilters {
  category?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  dropSlug?: string;
  activeDropOnly?: boolean;
  page?: number;
  limit?: number;
  popular?: string;
  student?: string;
}
