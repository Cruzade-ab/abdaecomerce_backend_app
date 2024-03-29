
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralProductDTO } from 'src/dto/products_dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async sendProducts(): Promise<GeneralProductDTO[]> {
        const products = await this.prisma.generalProduct.findMany({
            include: {
                Brand: true, // Changed from Brand to brand
                Section: true, // Include section at the general product level
                products: {
                    include: {
                        Color: true, // Changed from Color to color
                        Size_Amount: { // Changed from Size_Amount to sizeAmount
                            include: {
                                Size: true // Changed from Size to size
                            }
                        },
                    }
                },
            }
        });

        return products.map((gp) => ({
            general_product_id: gp.general_product_id,
            brand: {
                brand_id: gp.Brand.brand_id, // Changed from Brand to brand
                brand_name: gp.Brand.brand_name // Changed from Brand to brand
            },
            section: { // Assuming section is directly related to GeneralProduct
                section_id: gp.Section.section_id,
                section_name: gp.Section.section_name
            },
            general_product_name: gp.general_product_name,
            description: gp.description, // Added description here
            products: gp.products.map((p) => ({
                product_id: p.product_id,
                value: p.value,
                color: {
                    color_id: p.Color.color_id, // Changed from Color to color
                    color_name: p.Color.color_name, // Changed from Color to color
                    image_url: p.Color.image_url,
                    hover_image_url: p.Color.hover_image_url
                },
                size_amount: {
                    size_amount_id: p.Size_Amount.size_amount_id, // Changed from Size_Amount to sizeAmount
                    size_amount: p.Size_Amount.size_amount // Changed from Size_Amount to sizeAmount
                },
                size: {
                    size_id: p.Size_Amount.Size.size_id, // Changed from Size_Amount.Size to sizeAmount.size
                    size_name: p.Size_Amount.Size.size_type // Changed from Size_Amount.Size to sizeAmount.size
                }
            }))
        }));
    }
}
