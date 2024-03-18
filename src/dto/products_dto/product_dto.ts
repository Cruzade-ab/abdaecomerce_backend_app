// DTOs
export class ProductDTO {
    product_id: number;
    value: number;
    color: ColorDTO;
    description: string;
    section: SectionDTO;
    image_url: string;
    size_amount: SizeAmountDTO;
  }
  
  export class GeneralProductDTO {
    general_product_id: number;
    brand: BrandDTO;
    general_product_name: string;
    products: ProductDTO[];
  }
  
  export class BrandDTO {
    brand_id?: number;
    brand_name: string;
  }
  
  export class ColorDTO {
    color_id: number;
    color_name: string;
  }
  
  export class SectionDTO {
    section_id: number;
    section_name: string;
  }
  
  export class SizeAmountDTO {
    size_amount_id: number;
    size_amount: number;
  }

  export class SizeDTO {
    size_id: number;      
    size_type: string;
 }


  