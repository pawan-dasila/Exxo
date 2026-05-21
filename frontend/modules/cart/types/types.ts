export interface CartItemType {
  id: string;
  quantity: number;
  product_variants: {
    products: {
      id: string;
      title: string;
      image_url: string;
      base_price: string;
    };
    size: string;
    color_name: string;
  };
}
