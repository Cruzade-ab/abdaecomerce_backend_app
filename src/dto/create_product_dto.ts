export class ColorDTO {
  color_name: string;
  image_url: string;  
  hover_image_url: string;  
}

export class ProductDTO {
  value: number;
  color: ColorDTO;  // ColorDTO now includes image URLs
  size_amount: SizeAmountDTO;
  
}

export class CreatedProduct {
  brand: BrandDTO;
  general_product_name: string;
  description: string;
  section: SectionDTO;
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
  size: SizeDTO;  
}

export class SizeDTO { 
  size_type: string;
}
