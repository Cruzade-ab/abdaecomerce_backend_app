import { Controller, Post, Get, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { UserService } from 'src/user/user.service';
import { CartDisplayDto } from 'src/dto/cart-item.dto';

@Controller('api/cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  // Controlador para añadir un producto al carrito
  @Post('addToCart')
  async addToCart(
    @Req() request: Request,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<void> {
    const user = await this.userService.getUserFromToken(request);
    if (!user) {
      throw new Error('User not authenticated');
    }
    await this.cartService.addToCart(user.user_id, productId, quantity);
  }

  // Controlador para obtener la información del carrito
  @Get('getCartInfo')
  async getCartInfo(@Req() request: Request): Promise<CartDisplayDto[]> {
    const user = await this.userService.getUserFromToken(request);
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.cartService.getCartInfo(user.user_id);
  }
}
