// src/form-data/form-data.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralProductDTO, ProductDTO } from 'src/dto/products_dto/product_dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class FormDataService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async saveFormData(formData: GeneralProductDTO): Promise<void> {
    // Guardar los datos generales
    const savedGeneralProduct = await this.prisma.generalProduct.create({
      data: {
        general_product_name: formData.general_product_name,
        Brand: {
          connectOrCreate: {
            where: { brand_id: formData.brand.brand_id },
            create: { brand_name: formData.brand.brand_name },
          },
        },
      },
      include: {
        Brand: true,
        products: true,
      },
    });

    // Guardar los productos asociados
    for (const productData of formData.products) {
      // Guardar el color
      const savedColor = await this.prisma.color.create({
        data: {
          color_id: productData.color.color_id,
          color_name: productData.color.color_name,
        },
      });

      // Guardar la sección
      const savedSection = await this.prisma.section.create({
        data: {
          section_id: productData.section.section_id,
          section_name: productData.section.section_name,
        },
      });

      // Subir la imagen a Cloudinary y guardar la URL
      const uploadedImage = await this.cloudinaryService.uploadProductImage(productData.image_url);

      // Create the Product
      const savedProduct = await this.prisma.product.create({
        data: {
          value: productData.value,
          description: productData.description,
          Color: {
            connect: {
              color_id: savedColor.color_id,
            },
          },
          Section: {
            connect: {
              section_id: savedSection.section_id,
            },
          },
          image_url: uploadedImage, // Assuming 'image_url' is the correct field name
          GeneralProduct: {
            connect: {
              general_product_id: savedGeneralProduct.general_product_id,
            },
          },
        },
        include: {
          Section: true,
          Color: true,
        },
      });
    }
  }
}
