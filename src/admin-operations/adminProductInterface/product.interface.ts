export interface ProductRecived {
    general_product_name: string;
    brand_name: string;
    products: {
        value: string;
        color: string;
        description: string;
        section: string;
        size: string;
        size_amount: string;
        imageFile?: Express.Multer.File; // Optional property for imageFile
    }[];
};

export interface Product  {
  value: string;
  color: string;
  description: string;
  section: string;
  imageFile: File | null;
  size: string;
  size_amount: string;
};
