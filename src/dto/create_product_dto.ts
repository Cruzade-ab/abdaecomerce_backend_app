export class ColorDTO {
  color_name: string;
  image_url?: string;  // Optional: URL for the main image of the color
  hover_image_url?: string;  // Optional: URL for the hover image of the color
}

export class ProductDTO {
  value: number;
  color: ColorDTO;  // ColorDTO now includes image URLs
  description: string;
  section: SectionDTO;
  size_amount: SizeAmountDTO;
  // Removed image_url if images are only linked to colors
}

export class CreatedProduct {
  brand: BrandDTO;
  general_product_name: string;
  products: ProductDTO[];
}

export class BrandDTO {
  brand_name: string;
}

export class SectionDTO {
  section_name: string;
}

export class SizeAmountDTO {
  size_amount: number;
  size: SizeDTO;  // Assuming you want to include the size details directly
}

export class SizeDTO { 
  size_type: string;
}
