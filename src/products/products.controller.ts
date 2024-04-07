import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { GeneralProductDTO } from 'src/dto/products_dto';
import { ProductsService } from './products.service';

/**
 * Controller responsible for handling API endpoints related to products.
 */
@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    /**
     * Endpoint to get wanted products.
     * @returns Promise<GeneralProductDTO[]>
     */
    @Get('/wantedProducts')
    async getProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.getWantedProducts();
    }

    /**
     * Endpoint to get men's products.
     * @returns Promise<GeneralProductDTO[]>
     */
    @Get('/men')
    async getMenProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.getMenProducts();
    }

    /**
     * Endpoint to get women's products.
     * @returns Promise<GeneralProductDTO[]>
     */
    @Get('/women')
    async getWomenProducts(): Promise<GeneralProductDTO[]> {
        return this.productsService.getWomenProducts();
    }

    /**
     * Endpoint to get product by ID.
     * @param productVariantId Product variant ID
     * @returns Promise<GeneralProductDTO[] | null>
     */
    @Post('/getProductById')
    async getProductById(@Body('productVariantId') productVariantId: number): Promise<GeneralProductDTO[] | null> {
        console.log("Entering getProductById", productVariantId);
        return this.productsService.getProductById(productVariantId);
    }

    /**
     * Endpoint to add count to most wanted products.
     * @param productId Product ID
     */
    @Post('/addCountMostWanted')
    async setWantedProductCount(@Body('productId') productId: number) {
        console.log("Wanted product received", productId)
        return this.productsService.setWantedProductCount(productId);
    }
}
