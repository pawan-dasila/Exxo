import { Product, ProductImage, Brand, ProductOwner, Review } from "../../types";

export interface ExtendedProductImage extends ProductImage {
  sortOrder?: number;
}

export interface ExtendedProduct extends Product {
  images?: ExtendedProductImage[];
  brand?: Brand | null;
  owner?: ProductOwner | null;
  reviews?: Review[];
  avgRating?: number | null;
  reviewCount?: number;
}
