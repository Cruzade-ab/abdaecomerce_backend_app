import { Controller, Injectable, Post, Body } from '@nestjs/common';
import { ProductRecived } from './adminProductInterface/product.interface';
import { AdminOperationsService } from './admin-operations.service';
@Injectable()
@Controller('api')
export class AdminOperationsController {
    constructor(
        private readonly adminOpertionService :AdminOperationsService
    ) { }

    @Post('product/create')
    async createProduct(@Body() product: ProductRecived): Promise<ProductRecived> {
        console.log('Received product:', product);
        console.log('Product creation complete');
        return this.adminOpertionService.createProduct(product)
    }
}
