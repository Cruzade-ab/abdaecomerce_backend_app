import { Controller} from '@nestjs/common';
import { Post, Get, Injectable, Body, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDisplayDto } from 'src/dto/cart-item.dto';
import { UserService } from 'src/user/user.service';
import {  Request } from 'express';
import { ProductDTO } from 'src/dto/products_dto';

@Injectable()
@Controller('api/cart')
export class CartController {
    
    constructor(
        private readonly cartService: CartService, 
        private readonly userService: UserService) {}

    @Post('addToCart')
    async addToCart(@Body('productId') productId: number): Promise <ProductDTO> {

        return this.userService.addToCart(ProductDTO);
    }

    @Post('addToCart')
    async addToCart(@Req() request: Request, @Body('productId') productId: number, @Body('quantity') quantity: number): Promise<any> {
    const user = await this.userService.getUserFromToken(request);
    if (!user) {
        throw new Error('User not authenticated'); // Asegúrate de manejar este error adecuadamente
    }
    return this.cartService.addToCart(user.user_id, productId, quantity);
}

   

    @Get('getCartInfo')
    async getCartInfo(): Promise <CartDisplayDto[]> {
        return this.userService.getCartInfo()
    }



    @Get('getUserCart')
    async getUserCart(@Req() request: Request) {
        const user = await this.userService.getUserFromToken(request); // Llama al método getUserFromToken de UserService
        // Aquí puedes continuar con la lógica para obtener el carrito del usuario
    }
    

}
