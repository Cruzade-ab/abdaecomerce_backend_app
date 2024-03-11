import { Controller, Get } from '@nestjs/common';

@Controller('api/products')
export class ProductsController {

    @Get('/sendProducts')
    async sendProducts() {
        ;
    }
}
