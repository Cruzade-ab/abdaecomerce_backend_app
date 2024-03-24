import { Body, Controller, Post, UploadedFiles, UseInterceptors, UploadedFile, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
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

    @Post(':id/upload-image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @Param('id') productId: number,
        @UploadedFile() image: Express.Multer.File
    ) {
        if (!image) {
            throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
        }

        return this.adminOperationsService.uploadProductImage(productId, image);
    }
}
