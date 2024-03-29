export interface ColorReceived {
  color_name: string;
  image_url?: string;  // Assuming the image URL is sent as a string
  hover_image_url?: string;  // For the hover image
}

export interface ProductReceived {
  general_product_name: string;
  brand_name: string;
  products: {
      value: string;
      color: ColorReceived;
      description: string;
      section: string;
      size: string;
      size_amount: string;
      // Removed imageFile from here as it's now part of ColorReceived
  }[];
}

export interface Product {
  value: string;
  color: ColorReceived;
  description: string;
  section: string;
  size: string;
  size_amount: string;
  // Removed imageFile as it's now part of ColorReceived
}
