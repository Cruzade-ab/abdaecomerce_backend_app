
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralProductDTO } from 'src/dto/products_dto';


@Injectable()
export class ProductsService {

    constructor(private readonly prisma: PrismaService) { }

    async sendProducts(): Promise<GeneralProductDTO[]> {

        const products = await this.prisma.generalProduct.findMany({
            include: {
                Brand: true,
                products: {
                    include: {
                        Color: true,
                        Section: true,
                        Size_Amount: {
                            include: {Size: true}
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
            general_product_name: gp.general_product_name,
            products: gp.products
                .filter((p) => p.general_product_id === gp.general_product_id)
                .map((p) => ({
                    product_id: p.product_id,
                    value: p.value,
                    color: {
                        color_id: p.Color.color_id,
                        color_name: p.Color.color_name
                    },
                    description: p.description,
                    section: {
                        section_id: p.Section.section_id,
                        section_name: p.Section.section_name
                    },
                    image_url: p.image_url,
                    size_amount: {
                        size_amount_id: p.Size_Amount.size_amount_id,
                        size_amount: p.Size_Amount.size_amount
                    },
                    size: {
                        size_id: p.Size_Amount.Size.size_id, // Agregar size_id desde Size_Amount.Size
                        size_name: p.Size_Amount.Size.size_type // Agregar size_name desde Size_Amount.Size
                    }
                }))
        }));
    }
}
