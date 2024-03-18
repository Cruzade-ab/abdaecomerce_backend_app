import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GeneralProductDTO } from '../dto/products_dto/product_dto';

@Injectable()
export class AdminOperationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
        ) {}

    
        async createGeneralProduct(data: GeneralProductDTO, imageFile: Express.Multer.File): Promise<GeneralProductDTO> {
            const imageUrl = await this.cloudinary.uploadProductImage(imageFile.path, data.brand.brand_name, data.general_product_name);

            let brand = await this.prisma.brand.findFirst({
                where: { brand_name: data.brand.brand_name },
            });

            if (!brand) {
                brand = await this.prisma.brand.create({
                    data: { brand_name: data.brand.brand_name },
                });
            }


            const generalProduct = await this.prisma.generalProduct.create({
                data: {
                    general_product_name: data.general_product_name,
                    brand_id: brand.brand_id
                }
            })

            //Verificar los datos de las entidades, de no existir las crea (Color, Sectio, Size, SizeAmount)

            for (const product of data.products) {

                // color
                let color = await this.prisma.color.findFirst({
                    where: { color_name: product.color.color_name },
                }); 
    
                if (!color) {
                    color = await this.prisma.color.create({
                        data: { color_name: product.color.color_name },
                    });
                } // cierre color
    
                // section
                let section = await this.prisma.section.findFirst({
                    where: { section_name: product.section.section_name },
                });
    
                if (!section) {
                    section = await this.prisma.section.create({
                        data: { section_name: product.section.section_name },
                    });
                } // cierre sección

                // size
                let size = await this.prisma.size.findFirst({
                    where: { size_type: product.section.section_name },
                });
                
                if (!size) {
                    size = await this.prisma.size.create({
                        data: { size_type: product.section.section_name }
                    })
                } // cierre size
    
                
                let size_amount;
                if (size) {
                    size_amount = await this.prisma.size_Amount.create({
                        data: { 
                            size_amount: product.size_amount.size_amount,
                            // Don't need to set `size_amount_id` if it's autoincremented
                            size_id: size.size_id  // Connect the `Size_Amount` with the created/found `Size`
                        }
                    });
                }
                
                await this.prisma.product.create({
                    data: {
                        product_id: product.product_id,
                        value: product.value,
                        color_id: color.color_id,
                        description: product.description,
                        section_id: section.section_id,
                        image_url: imageUrl,
                        Size_Amount: size_amount 
                        // add other necessary fields and relationships
                    },
                });
            }


            return this.sendProductsById(generalProduct.general_product_id);
        }



    }
}
