import { Controller, Get } from '@nestjs/common';
import { GeneralProductDTO } from '../dto/products_dto/product_dto';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
    constructor( private readonly productsService: ProductsService ){}

    @Get('/sendProducts')
    async sendProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.sendProducts()
    }
}
