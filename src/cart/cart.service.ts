import { Injectable } from '@nestjs/common';
import { AddToCartDto } from 'src/dto/cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from 'src/dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addProductToCart(userId: number, { productId, sizeId, productPrice }: AddToCartDto): Promise<CartItemDto[]> {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      throw new Error('No se encontró el carrito del usuario.');
    }

    // Add product to the cart
    const cartItem = await this.prisma.cartItem.create({
      data: {
        cart_id: cart.cart_id,
        product_id: productId,
        product_price: productPrice,
      },
      include: { product: true },
    });

    // Update cart total price
    const updatedCart = await this.prisma.cart.update({
      where: { cart_id: cart.cart_id },
      data: { cart_total_price: cart.cart_total_price + productPrice },
      include: { cartItems: { include: { product: true } } },
    });

    return updatedCart.cartItems.map(item => ({
        productPrice: item.product_price,
        imageUrl: item.product.image_url,
        size: item.product.size_amount_id, 
        totalPrice: updatedCart.cart_total_price,
      }));
      
      
      
  }
}
