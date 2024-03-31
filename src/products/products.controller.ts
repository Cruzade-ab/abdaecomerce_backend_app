import { Body, Controller, Get, Post } from '@nestjs/common';
import { GeneralProductDTO } from 'src/dto/products_dto';
import { ProductsService } from './products.service';
import { WantedProductDTO } from 'src/dto/wanted_product';

@Controller('api/products')
export class ProductsController {
    constructor( private readonly productsService: ProductsService ){}

    @Get('/wantedProducts')
    async getProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.getWantedProducts()
    }

    @Get('/men')
    async getMenProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.getMenProducts()
    }

    
    @Get('/women')
    async getWomenProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.getWomenProducts()
    }

    @Post('wantedProduct')
    async setWantedProductCount(@Body() data: WantedProductDTO ) {
        return 
    }
}