import { Controller, Post, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from 'src/dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/add-product')
  async addProductToCart(
    @Param('userId') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    await this.cartService.addProductToCart(userId, addToCartDto);
    return { message: 'Product added to cart successfully' };
  }
}
