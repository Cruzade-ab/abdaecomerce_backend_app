import { Controller, Injectable, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductRecived } from './adminProductInterface/product.interface';
import { AdminOperationsService } from './admin-operations.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express'; // Import Express types

@Injectable()
@Controller('api')
export class AdminOperationsController {
    constructor(
        private readonly adminOperationService: AdminOperationsService
    ) { }

    @Post('product/create')
    @UseInterceptors(FilesInterceptor('files'))
    async createProduct(
        @Body() product: ProductRecived,
        @UploadedFiles() files: Express.Multer.File[],): Promise<ProductRecived> {
        console.log('Received product:', product);
        console.log('Received files:', files);
        console.log('Entering createProduct method');
        return this.adminOperationService.createProduct(product, files);
    }
}
