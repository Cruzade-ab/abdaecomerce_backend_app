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
        try {
            // Subir la imagen a Cloudinary
            const imageUrl = await this.cloudinary.uploadProductImage(data.brand.brand_name, data.general_product_name, imageFile.path);

            // Crear o encontrar la marca
            let brand = await this.prisma.brand.findFirst({
                where: { brand_name: data.brand.brand_name },
            });
            if (!brand) {
                brand = await this.prisma.brand.create({
                    data: { brand_name: data.brand.brand_name },
                });
            }

            // Crear el producto general
            const generalProduct = await this.prisma.generalProduct.create({
                data: {
                    general_product_name: data.general_product_name,
                    brand_id: brand.brand_id,
                },
                include: { Brand: true }, // Incluir la marca para evitar una consulta adicional
            });

            // Crear y guardar cada producto individual
            for (const product of data.products) {
                // Crear o encontrar el color
                let color = await this.prisma.color.findFirst({
                    where: { color_name: product.color.color_name },
                });
                if (!color) {
                    color = await this.prisma.color.create({
                        data: { color_name: product.color.color_name },
                    });
                }

                // Crear o encontrar la sección
                let section = await this.prisma.section.findFirst({
                    where: { section_name: product.section.section_name },
                });
                if (!section) {
                    section = await this.prisma.section.create({
                        data: { section_name: product.section.section_name },
                    });
                }

                // Crear o encontrar la cantidad de tamaño
                let size_amount = await this.prisma.size_Amount.create({
                    data: {
                        size_amount: product.size_amount.size_amount,
                        Size: {
                            connectOrCreate: {
                                where: { size_id: product.size_amount.size_id.size_id }, // Accede a la propiedad size_id del objeto SizeDTO
                                create: { 
                                    size_id: product.size_amount.size_id.size_id, // Asigna size_id aquí
                                    size_type: product.size_amount.size_amount.toString() // Convierte size_amount a cadena de texto
                                }
                            }
                        }
                    }
                });
                
                

                // Crear el producto
                await this.prisma.product.create({
                    data: {
                        value: product.value,
                        color_id: color.color_id,
                        description: product.description,
                        section_id: section.section_id,
                        image_url: imageUrl,
                        size_amount_id: size_amount.size_amount_id,
                        general_product_id: generalProduct.general_product_id,
                    },
                });
            }

            // Devolver los datos completos del producto creado
            return {
                ...generalProduct,
                brand: {
                    brand_id: generalProduct.Brand.brand_id,
                    brand_name: generalProduct.Brand.brand_name,
                },
                products: data.products.map((p, index) => ({
                    ...p,
                    image_url: imageUrl, // Utilizar la URL de la imagen subida
                })),
            }; 
        } catch (error) {
            // Manejar errores de manera adecuada
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }
}
