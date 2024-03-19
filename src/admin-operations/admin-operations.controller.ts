import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOperationsService } from './admin-operations.service';
import { GeneralProductDTO } from 'src/dto/products_dto/product_dto';

@Controller('products')
export class AdminOperationsController {
    constructor(private readonly adminOperationsService: AdminOperationsService) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    async createProduct(
        @Body() productData: GeneralProductDTO,
        @UploadedFiles() imageFiles: Express.Multer.File[]
    ) {
        return this.adminOperationsService.createGeneralProduct(productData, imageFiles);
    }
}
