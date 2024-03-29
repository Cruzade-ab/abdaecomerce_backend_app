export class ProductDTO {
    value: number;
    color: ColorDTO;
    description: string;
    section: SectionDTO;
    image_url: string;
    size_amount: SizeAmountDTO;
  }
  
  export class CreatedProduct {
    brand: BrandDTO;
    general_product_name: string;
    products: ProductDTO[];
  }
  
  export class BrandDTO {
    brand_name: string;
  }
  
  export class ColorDTO {
    color_name: string;
  }
  
  export class SectionDTO {
    section_name: string;
  }
  
  export class SizeAmountDTO {
    size_amount: number;
    size_id?: SizeDTO
  }

  export class SizeDTO { 
    size_type: string;
 }

