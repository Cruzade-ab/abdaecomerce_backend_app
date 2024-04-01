
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralProductDTO } from 'src/dto/products_dto';
import { WantedProductDTO } from 'src/dto/wanted_product';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async getWantedProducts(): Promise<GeneralProductDTO[]> {
        const products = await this.prisma.generalProduct.findMany({
            include: {
                Brand: true,
                Section: true, 
                products: {
                    include: {
                        Color: true, 
                        Size_Amount: { 
                            include: {
                                Size: true 
                            }
                        },
                    }
                },
            }
        });

        return products.map((gp) => ({
            general_product_id: gp.general_product_id,
            brand: {
                brand_id: gp.Brand.brand_id,
                brand_name: gp.Brand.brand_name 
            },
            section: { 
                section_id: gp.Section.section_id,
                section_name: gp.Section.section_name
            },
            general_product_name: gp.general_product_name,
            description: gp.description, 
            products: gp.products.map((p) => ({
                product_id: p.product_id,
                value: p.value,
                image_url: p.image_url,
                hover_image_url: p.hover_image_url ,
                color: {
                    color_id: p.Color.color_id, 
                    color_name: p.Color.color_name, 
                },
                size_amount: {
                    size_amount_id: p.Size_Amount.size_amount_id,
                    size_amount: p.Size_Amount.size_amount 
                },
                size: {
                    size_id: p.Size_Amount.Size.size_id, 
                    size_name: p.Size_Amount.Size.size_type },

            }))
        }));
    }



    async getMenProducts(): Promise<GeneralProductDTO[]> {
        const products = await this.prisma.generalProduct.findMany({
            where: {section_id: 1 },
            include: {
                Brand: true,
                Section: true, 
                products: {
                    include: {
                        Color: true, 
                        Size_Amount: { 
                            include: {
                                Size: true 
                            }
                        },
                    }
                },
            }
        });

        return products.map((gp) => ({
            general_product_id: gp.general_product_id,
            brand: {
                brand_id: gp.Brand.brand_id,
                brand_name: gp.Brand.brand_name 
            },
            section: { 
                section_id: gp.Section.section_id,
                section_name: gp.Section.section_name
            },
            general_product_name: gp.general_product_name,
            description: gp.description, 
            products: gp.products.map((p) => ({
                product_id: p.product_id,
                value: p.value,
                image_url: p.image_url,
                hover_image_url: p.hover_image_url ,
                color: {
                    color_id: p.Color.color_id, 
                    color_name: p.Color.color_name, 
                },
                size_amount: {
                    size_amount_id: p.Size_Amount.size_amount_id,
                    size_amount: p.Size_Amount.size_amount 
                },
                size: {
                    size_id: p.Size_Amount.Size.size_id, 
                    size_name: p.Size_Amount.Size.size_type },

            }))
        }));
    }



    async getWomenProducts(): Promise<GeneralProductDTO[]> {
        const products = await this.prisma.generalProduct.findMany({
            where: {section_id: 2 },
            include: {
                Brand: true,
                Section: true, 
                products: {
                    include: {
                        Color: true, 
                        Size_Amount: { 
                            include: {
                                Size: true 
                            }
                        },
                    }
                },
            }
        });

        return products.map((gp) => ({
            general_product_id: gp.general_product_id,
            brand: {
                brand_id: gp.Brand.brand_id,
                brand_name: gp.Brand.brand_name 
            },
            section: { 
                section_id: gp.Section.section_id,
                section_name: gp.Section.section_name
            },
            general_product_name: gp.general_product_name,
            description: gp.description, 
            products: gp.products.map((p) => ({
                product_id: p.product_id,
                value: p.value,
                image_url: p.image_url,
                hover_image_url: p.hover_image_url ,
                color: {
                    color_id: p.Color.color_id, 
                    color_name: p.Color.color_name, 
                },
                size_amount: {
                    size_amount_id: p.Size_Amount.size_amount_id,
                    size_amount: p.Size_Amount.size_amount 
                },
                size: {
                    size_id: p.Size_Amount.Size.size_id, 
                    size_name: p.Size_Amount.Size.size_type },

            }))
        }));
    }



    async getProductById(id: number): Promise<GeneralProductDTO[]> {
        console.log("Getting product by Id:", id);

        const productId = parseInt(id.toString(), 10);
    
        const productVariant = await this.prisma.product.findFirst({
            where: { product_id: productId }
        });
    
        if (!productVariant) {
            throw new Error(`Product with ID ${productId} not found`);
        }

    
        const products = await this.prisma.generalProduct.findMany({
            where: { general_product_id: productVariant.general_product_id },
            include: {
                Brand: true,
                Section: true,
                products: {
                    include: {
                        Color: true,
                        Size_Amount: {
                            include: {
                                Size: true
                            }
                        },
                    }
                },
            }
        });
    
         const GeneralProduct = products.map((gp) => ({
            general_product_id: gp.general_product_id,
            brand: {
                brand_id: gp.Brand.brand_id,
                brand_name: gp.Brand.brand_name
            },
            section: {
                section_id: gp.Section.section_id,
                section_name: gp.Section.section_name
            },
            general_product_name: gp.general_product_name,
            description: gp.description,
            products: gp.products.map((p) => ({
                product_id: p.product_id,
                value: p.value,
                image_url: p.image_url,
                hover_image_url: p.hover_image_url,
                color: {
                    color_id: p.Color.color_id,
                    color_name: p.Color.color_name,
                },
                size_amount: {
                    size_amount_id: p.Size_Amount.size_amount_id,
                    size_amount: p.Size_Amount.size_amount
                },
                size: {
                    size_id: p.Size_Amount.Size.size_id,
                    size_name: p.Size_Amount.Size.size_type
                },
            }))
        }));
        console.log(GeneralProduct)
        
        return GeneralProduct
    }
    
    async setWantedProductCount(id: number) {
        console.log("Setting wanted count for product by Id:", id);

        const productId = parseInt(id.toString(), 10);
    
        const productVariant = await this.prisma.product.findFirst({
            where: { product_id: productId }
        });
    
        if (!productVariant) {
            throw new Error(`Product with ID ${productId} not found`);
        }
    
        // Presumably update or process the wanted count here
        console.log("Product General:", productVariant);
    
        // Return appropriate response or update result
        return { message: "Wanted product count updated", product: productVariant };
    }
}
