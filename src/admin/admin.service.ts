import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductReceived } from "src/dto/product_recived";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ) {}

    async createProduct(data: ProductReceived, files: Express.Multer.File[]): Promise<ProductReceived> {
        try {
            let existingBrandName = await this.prisma.brand.findFirst({
                where: { brand_name: data.brand_name }
            });
            console.log('Existing brand:', existingBrandName);

            if (!existingBrandName) {
                existingBrandName = await this.prisma.brand.create({
                    data: { brand_name: data.brand_name }
                });
                console.log('Brand created:', existingBrandName);
            }

            let sectionEntity = await this.prisma.section.findFirst({ where: { section_name: data.section } });
            console.log('Existing section:', sectionEntity);

            if (!sectionEntity) {
                sectionEntity = await this.prisma.section.create({ data: { section_name: data.section } });
                console.log('Section created:', sectionEntity);
            }

            let existingGeneralProduct = await this.prisma.generalProduct.findFirst({
                where: { general_product_name: data.general_product_name },
            });
            console.log('Existing general product:', existingGeneralProduct);

            if (!existingGeneralProduct) {
                existingGeneralProduct = await this.prisma.generalProduct.create({
                    data: {
                        general_product_name: data.general_product_name,
                        brand_id: existingBrandName.brand_id,
                        description: data.description,
                        section_id: sectionEntity.section_id,
                    },
                });
                console.log('General product created:', existingGeneralProduct);
            }

            for (const [index, variant] of data.products.entries()) {
                let color = await this.prisma.color.findUnique({
                    where: { color_name: variant.color_name }
                });
                if (!color) {
                    color = await this.prisma.color.create({
                        data: { color_name: variant.color_name }
                    });
                    console.log('Color created:', color);
                }

                const mainImageFile = files.find(file => file.fieldname === `products[${index}][imageFile]`);
                const hoverImageFile = files.find(file => file.fieldname === `products[${index}][hoverImageFile]`);
            
                let mainImageUrl = '';
                let hoverImageUrl = '';

                if (mainImageFile) {
                    mainImageUrl = await this.cloudinary.uploadAndGetUrl(mainImageFile);
                    console.log('Main image uploaded:', mainImageUrl);
                }

                if (hoverImageFile) {
                    hoverImageUrl = await this.cloudinary.uploadAndGetUrl(hoverImageFile);
                    console.log('Hover image uploaded:', hoverImageUrl);
                }
            
                for (const sizeType of Object.keys(variant.sizes)) {
                    console.log('Processing size type:', sizeType);
                
                    const sizeEntity = await this.prisma.size.findUnique({
                        where: { size_type: sizeType }
                    });
                    console.log('Retrieved size entity:', sizeEntity);
                
                    if (sizeEntity) {
                        const sizeAmount = await this.prisma.size_Amount.create({
                            data: {
                                size_id: sizeEntity.size_id, // Use the retrieved size_id dynamically
                                size_amount: parseInt(variant.sizes[sizeType] )
                            }
                        });
                        console.log('Created size amount:', sizeAmount);
                
                        const product = await this.prisma.product.create({
                            data: {
                                value: parseFloat(variant.value),
                                color_id: color.color_id,
                                general_product_id: existingGeneralProduct.general_product_id,
                                image_url: mainImageUrl, 
                                hover_image_url: hoverImageUrl,
                                size_amount_id: sizeAmount.size_amount_id
                            }
                        });
                        console.log('Product created:', product);
                    } else {
                        console.log('Size entity not found for size type:', sizeType);
                    }
                }
            }

            return data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw new HttpException('Failed to create product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
}