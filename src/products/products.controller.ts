import { Controller, Get } from '@nestjs/common';
import { GeneralProductDTO } from 'src/dto/products_dto';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
    constructor( private readonly productsService: ProductsService ){}

    @Get('/getAllProducts')
    async sendProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.sendProducts()
    }
}