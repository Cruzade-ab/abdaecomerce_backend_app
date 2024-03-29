import { Injectable, Controller, Post, UseInterceptors, Body, UploadedFiles } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductRecived } from "src/dto/product_recived";
import { AdminService } from "./admin.service";

@Controller('api/admin')
@Injectable()
export class AdminController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService
        ) {}

    @Post('/product/create')
    @UseInterceptors(FilesInterceptor('files'))
    async createProduct(
        @Body() product: ProductRecived,
        @UploadedFiles() files: Express.Multer.File[],): Promise<ProductRecived> {
        console.log('Received product:', product);
        console.log('Received files:', files);
        console.log('Entering createProduct method');
        return this.adminService.createProduct(product, files);
    }
}