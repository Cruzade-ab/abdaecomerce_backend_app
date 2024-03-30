import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductReceived } from "src/dto/product_recived";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class AdminService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ) { }

    async createProduct(data: ProductReceived, files: Express.Multer.File[]): Promise<ProductReceived> {
        console.log('Entering createProduct method');
        console.log(data);

        const { brand_name, general_product_name, products, description, section } = data;

        try {
            // Check if the brand already exists.
            let existingBrandName = await this.prisma.brand.findFirst({
                where: { brand_name }
            });

            if (!existingBrandName) {
                existingBrandName = await this.prisma.brand.create({
                    data: { brand_name: brand_name }
                });
            }

            // Check if the General Product already exists
            let existingGeneralProduct = await this.prisma.generalProduct.findFirst({
                where: { general_product_name },
            });

            let sectionEntity = await this.prisma.section.findFirst({ where: { section_name: section } });
            if (!sectionEntity) {
                sectionEntity = await this.prisma.section.create({ data: { section_name: section } });
            }

            if (!existingGeneralProduct) {
                // Create the General Product if it doesn't exist
                existingGeneralProduct = await this.prisma.generalProduct.create({
                    data: {
                        general_product_name: general_product_name,
                        brand_id: existingBrandName.brand_id,
                        description: description,
                        section_id: sectionEntity.section_id,
                    },
                });
            }

            for (let i = 0; i < products.length; i++) {
                const productData = products[i];
                const { color_name, sizes, value, image_url, hover_image_url } = productData;
                
                const recived_image_url = image_url[i]
                const recived_hover_image_url = hover_image_url[i]

                // Upload images to Cloudinary
                const image_url_recived = await this.cloudinary.uploadAndGetUrl(recived_image_url);
                const image_hover_url_recived = await this.cloudinary.uploadAndGetUrl(recived_hover_image_url);

                let existingColor = await this.prisma.color.findFirst({
                    where: { color_name }
                });
                if(existingColor!){
                    existingColor = await this.prisma.color.create({
                        data: {
                            color_name: color_name
                        }
                    })
                }

                // Create sizes and associate them with the product
                for (const sizeKey in sizes) {
                    if (Object.prototype.hasOwnProperty.call(sizes, sizeKey)) {
                        const sizeValue = sizes[sizeKey];
                        let sizeEntity = await this.prisma.size.findFirst({ where: { size_type: sizeKey } });
                        if (!sizeEntity) {
                            sizeEntity = await this.prisma.size.create({ data: { size_type: sizeKey } });
                        }

                        // Create SizeAmount for each size and associate it with the product
                        let sizeAmountEntity = await this.prisma.size_Amount.create({
                            data: {
                                size_amount: sizeValue,
                                size_id: sizeEntity.size_id,
                            },
                        });

                        // Create the Product with uploaded image URLs and associated SizeAmount
                        await this.prisma.product.create({
                            data: {
                                value: parseFloat(value),
                                color_id: existingColor.color_id,
                                image_url: image_url_recived,
                                hover_image_url: image_hover_url_recived,
                                general_product_id: existingGeneralProduct.general_product_id,
                                size_amount_id: sizeAmountEntity.size_amount_id
                            },
                        });
                    }
                }
            }

            return data;
        } catch (error) {
            throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
