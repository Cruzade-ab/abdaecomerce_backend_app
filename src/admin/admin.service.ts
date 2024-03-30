import { HttpException, HttpStatus, Injectable, UploadedFile } from "@nestjs/common";
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
        console.log('Entering createProduct method')
        console.log(data)

        const { brand_name, general_product_name, products, description, section, } = data;


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

            let sectionEntity = await this.prisma.section.findFirst({ where: { section_name: section } })
            if (!sectionEntity) {
                sectionEntity = await this.prisma.section.create({ data: { section_name: section } })
            }

            if (!existingGeneralProduct) {
                // Create the General Product if it doesn't exist
                existingGeneralProduct = await this.prisma.generalProduct.create({
                    data: {
                        general_product_name: general_product_name,
                        brand_id: existingBrandName.brand_id,
                        description: description,
                        section_id: sectionEntity.section_id, // Add description heresection, 
                    },
                });
            }


            for (let i = 0; i < products.length; i++) {
                const productData = products[i];
                const { color, size, size_amount, value } = productData;
                const recived_image = color.image_url[i]
                const recived_hover_image = color.image_url[i]



                const image_url = await this.cloudinary.uploadAndGetUrl(recived_image);


                const image_hover_url = await this.cloudinary.uploadAndGetUrl(recived_hover_image);




                // Check if Color exists, create if not, including handling image uploads
                let colorEntity = await this.prisma.color.findFirst({ where: { color_name: color.color_name } });
                if (!colorEntity) {
                    colorEntity = await this.prisma.color.create({
                        data: {
                            color_name: color.color_name,
                            image_url: image_url ,
                            hover_image_url: image_hover_url,
                        }
                    });
                }

                // Check if Size exists, create if not
                let sizeEntity = await this.prisma.size.findFirst({ where: { size_type: size } });
                if (!sizeEntity) {
                    sizeEntity = await this.prisma.size.create({ data: { size_type: size } });
                }

                let sizeAmountEntity = await this.prisma.size_Amount.create({
                    data: {
                        size_amount: parseInt(size_amount),
                        size_id: sizeEntity.size_id
                    }
                });

                // Create the Product
                await this.prisma.product.create({
                    data: {
                        value: parseFloat(value),
                        color_id: colorEntity.color_id,
                        size_amount_id: sizeAmountEntity.size_amount_id,
                        general_product_id: existingGeneralProduct.general_product_id,
                    },
                });
            }
            return data
        } catch (error) {
            throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR);
            // Handle the error appropriately
        }

    }
}

