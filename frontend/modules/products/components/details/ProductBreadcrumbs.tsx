import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ExtendedProduct } from "./types";

interface ProductBreadcrumbsProps {
  product: ExtendedProduct;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <div className="border-b border-neutral-100 bg-white">
      <div className="mx-auto max-w-4xl py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">
                  {product.category?.name || "Catalog"}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {product.brand && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/products?brand=${product.brand.id}`}>
                      {product.brand.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] md:max-w-xs truncate">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
