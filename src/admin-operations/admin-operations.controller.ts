// src/form-data/form-data.service.ts

import { Controller, Injectable, Post, Body } from '@nestjs/common';
import { Product } from './adminProductInterface/product.interface';

@Injectable()
@Controller('api')
export class FormDataService {
    @Post('product/create')
    async createProduct(@Body() product: Product): Promise<Product> {
        // Logic to process the received product data
        console.log('Received product:', product);

        console.log('Product creation complete');
        return product;
    }
}
