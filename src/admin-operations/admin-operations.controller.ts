import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
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
        @UploadedFile() imageFile: Express.Multer.File
    ) {
        return this.adminOperationsService.createGeneralProduct(productData, imageFile);
    }

    @Post('create')
    async probarRuta() {
        return "Hola Mundo";
    }
}
