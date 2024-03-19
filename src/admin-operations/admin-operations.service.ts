import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreatedProduct } from '../dto/products_dto/CreateProduct_dto';
import { GeneralProductDTO } from 'src/dto/products_dto/product_dto';

@Injectable()
export class AdminOperationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ) {}

    async createGeneralProduct(data: CreatedProduct, imageFiles: Express.Multer.File[]): Promise<GeneralProductDTO> {
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
                brand_id: brand.brand_id,
            },
        });

        for (const [index, product] of data.products.entries()) {
            const imageFile = imageFiles[index];
            const imageUrl = imageFile
                ? await this.cloudinary.uploadProductImage(imageFile.path, data.brand.brand_name, data.general_product_name)
                : null;

            let color = await this.prisma.color.findFirst({
                where: { color_name: product.color.color_name },
            });

            if (!color) {
                color = await this.prisma.color.create({
                    data: { color_name: product.color.color_name },
                });
            }

            let section = await this.prisma.section.findFirst({
                where: { section_name: product.section.section_name },
            });

            if (!section) {
                section = await this.prisma.section.create({
                    data: { section_name: product.section.section_name },
                });
            }

            let size = await this.prisma.size.findFirst({
                where: { size_type: product.size_amount.size_id.size_type },
            });

            if (!size) {
                size = await this.prisma.size.create({
                    data: { size_type: product.size_amount.size_id.size_type },
                });
            }

            await this.prisma.product.create({
                data: {
                    value: product.value,
                    color_id: color.color_id,
                    description: product.description,
                    section_id: section.section_id,
                    image_url: imageUrl,
                    size_amount_id: size.size_id,
                    general_product_id: generalProduct.general_product_id,
                },
            });
        }

        return this.sendProductsById(generalProduct.general_product_id);
    }

    private async sendProductsById(generalProductId: number): Promise<GeneralProductDTO> {
        const product = await this.prisma.generalProduct.findUnique({
            where: { general_product_id: generalProductId },
            include: {
                Brand: true,
                products: {
                    include: {
                        Color: true,
                        Section: true,
                        Size_Amount: { include: { Size: true } },
                    },
                },
            },
        });

        if (!product) {
            throw new HttpException('General Product not found', HttpStatus.NOT_FOUND);
        }

        return this.getCreatedProduct(product);
    }

    private getCreatedProduct(product: any): GeneralProductDTO {
        // Transform the product entity into GeneralProductDTO format and return it
        return {
            general_product_id: product.general_product_id,
            brand: {
                brand_id: product.Brand.brand_id,
                brand_name: product.Brand.brand_name
            },
            general_product_name: product.general_product_name,
            products: product.products.map(p => ({
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
                    size_id: p.Size_Amount.Size.size_id,
                    size_name: p.Size_Amount.Size.size_type
                }
            }))
        };
    }
}
