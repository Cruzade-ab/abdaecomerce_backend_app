import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number): Promise<any> {
    // Verificar si el usuario ya tiene un carrito
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    // Si no tiene un carrito, crear uno
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          user_id: userId,
          cart_total_price: 0, // Inicializar con un total de 0
        },
      });
    }

    // Verificar si el producto ya está en el carrito
    let cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.cart_id,
          product_id: productId,
        },
      },
    });

    // Si el producto ya está en el carrito, actualizar la cantidad
    if (cartItem) {
      cartItem = await this.prisma.cartItem.update({
        where: {
          cart_item_id: cartItem.cart_item_id,
        },
        data: {
          product_quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      // Si el producto no está en el carrito, agregarlo
      cartItem = await this.prisma.cartItem.create({
        data: {
          cart: {
            connect: { cart_id: cart.cart_id },
          },
          product: {
            connect: { product_id: productId },
          },
          product_price: 0, // El precio se actualizará después de calcularlo
          product_quantity: quantity,
        },
      });
    }

    // Obtener el precio del producto y actualizar el precio del ítem del carrito
    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
      include: { Size_Amount: true },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const productTotalPrice = product.value * quantity;

    await this.prisma.cartItem.update({
      where: {
        cart_item_id: cartItem.cart_item_id,
      },
      data: {
        product_price: product.value, // Actualizar con el precio del producto
      },
    });

    // Actualizar el precio total del carrito
    await this.prisma.cart.update({
      where: { cart_id: cart.cart_id },
      data: { cart_total_price: { increment: productTotalPrice } },
    });

    // Crear DTO para enviar al frontend
    const cartDisplayDto = {
      product_id: productId,
      product_price: product.value,
      quantity: quantity,
      size_available: product.Size_Amount.size_amount, // Asumiendo que hay una relación directa entre Product y Size_Amount
      image_url: product.image_url,
    };

    return cartDisplayDto;
  }

  // Implementar el resto de los métodos según sea necesario
}
