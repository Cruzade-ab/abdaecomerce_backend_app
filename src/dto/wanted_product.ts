export class WantedProductDTO {
    product_id: number;
    value: number;
    image_url: string;
    hover_image_url: string; 
    color: ColorDTO; 
    size_amount: SizeAmountDTO;
  }

  export class ColorDTO {
    color_id: number;
    color_name: string;

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
