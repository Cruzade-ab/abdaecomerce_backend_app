  // DTOs
  export class ProductDTO {
    product_id: number;
    value: number;
    color: ColorDTO; // ColorDTO now includes image_url and hover_image_url
   
    size_amount: SizeAmountDTO;
  }
  
  export class GeneralProductDTO {
    general_product_id: number;
    brand: BrandDTO;
    general_product_name: string;
    description: string;
    section: SectionDTO;
    products: ProductDTO[];
  }
  
  export class BrandDTO {
    brand_id?: number;
    brand_name: string;
  }
  
  export class ColorDTO {
    color_id: number;
    color_name: string;
    image_url: string; // Optional if the image URL can be null
    hover_image_url: string; // Optional if the hover image URL can be null
  }
  
  export class SectionDTO {
    section_id: number;
    section_name: string;
  }
  
  export class SizeAmountDTO {
    size_amount_id: number;
    size_amount: number;
    size_id?: SizeDTO
  }

  export class SizeDTO {
    size_id: number;      
    size_type: string;
}


  