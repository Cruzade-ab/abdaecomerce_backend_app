import { Injectable, Controller, Post, UseInterceptors, Body, UploadedFiles, Put, } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ProductReceived } from "src/dto/product_recived";
import { AdminService } from "./admin.service";
import { Product } from "src/dto/products_dto";

@Controller('api/admin')
@Injectable()
export class AdminController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService
    ) {}

    @Post('/product/create')
    @UseInterceptors(AnyFilesInterceptor())
    async createProduct(
        @Body() product: ProductReceived,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<ProductReceived> {
        console.log('Received product:', product);
        console.log('Received files:', files);
        console.log('Entering createProduct method');
        return this.adminService.createProduct(product, files);
    }


    @Put('/product/update')
    @UseInterceptors(AnyFilesInterceptor())
    async updateProduct(
        @Body() product: ProductReceived,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<ProductReceived>{
        console.log('Received product:', product);
        console.log('Received files:', files);
        console.log('Entering createProduct method');
        return this.adminService.updateProduct(product, files);
    }
}
