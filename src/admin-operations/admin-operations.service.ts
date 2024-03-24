import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductRecived } from './adminProductInterface/product.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class AdminOperationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ) { }

    async createProduct(data: ProductRecived, files:  Express.Multer.File[]): Promise<ProductRecived> {
      console.log('Entering createProduct method')
      console.log(data)

      const { brand_name, general_product_name, products } = data;


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

            if (!existingGeneralProduct) {
                // Create the General Product if it doesn't exist
                existingGeneralProduct = await this.prisma.generalProduct.create({
                    data: { general_product_name: general_product_name, brand_id: existingBrandName.brand_id },
                });
            }

            // Process each product in the array
            for (let i = 0; i < products.length; i++) {
              const productData = products[i];
              const { color, size, size_amount, value, description, section } = productData;
              const imageFile = files[i];


                // Check if Color exists, create if not
                let colorEntity = await this.prisma.color.findFirst({ where: { color_name: color } });
                if (!colorEntity) {
                    colorEntity = await this.prisma.color.create({ data: { color_name: color } });
                }

                // Check if Size exists, create if not
                let sizeEntity = await this.prisma.size.findFirst({ where: { size_type: size } });
                if (!sizeEntity) {
                    sizeEntity = await this.prisma.size.create({ data: { size_type: size } });
                }

                let sizeAmount = await this.prisma.size_Amount.create({
                    data: {
                        size_amount: parseInt(size_amount), // Convert string to number
                        Size: { connect: { size_id: sizeEntity.size_id } }
                    }
                });

                let sectionEntity = await this.prisma.section.findFirst({ where: { section_name: section } })
                if (!sectionEntity) {
                    sectionEntity = await this.prisma.section.create({ data: { section_name: section } })
                }

                // Upload product image to Cloudinary
                if (imageFile) {
                  const imageUrl = await this.cloudinary.uploadFile(imageFile);


                    // Create the Product with the image URL
                    await this.prisma.product.create({
                        data: {
                            value: parseFloat(value),
                            color_id: colorEntity.color_id,
                            description: description,
                            section_id: sectionEntity.section_id,
                            image_url: imageUrl, // Assuming image_url is a field in your database
                            size_amount_id: sizeAmount.size_amount_id,
                            general_product_id: existingGeneralProduct.general_product_id,
                        },
                    });
                } else {
                    // Handle case when imageFile is null (optional)
                    // For example, you can log a message or skip creating the product
                    console.log('Image file is null for product:', productData);
                }
            }

            return data;
        } catch (error) {
            throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
