export interface Product {
    brand_name: string;
    general_product_name: string;
    products: {
        color: string;
        description: string;
        imageFile: FileList;
        section: string;
        size: string;
        size_amount: string;
        value: string;
    }[];
}