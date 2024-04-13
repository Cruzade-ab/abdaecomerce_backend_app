import { Injectable } from '@nestjs/common';
import { CartDisplayDto } from 'src/dto/cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Método para añadir un producto al carrito de un usuario
  async addToCart(userId: number, productId: number, quantity: number): Promise<void> {
    console.log('Agregando Producto: ', productId)
    // Buscar si el usuario ya tiene un carrito
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    // Si no existe un carrito, crear uno nuevo con precio total inicial de 0
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          user_id: userId,
          cart_total_price: 0,
        },
      });
    }

    // Buscar si el producto ya está en el carrito
    let cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.cart_id,
          product_id: productId,
        },
      },
    });

    // Si el producto ya está en el carrito, incrementar la cantidad
    if (cartItem) {
      await this.prisma.cartItem.update({
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
      // Si el producto no está en el carrito, agregarlo con la cantidad especificada
      await this.prisma.cartItem.create({
        data: {
          cart: {
            connect: { cart_id: cart.cart_id },
          },
          product: {
            connect: { product_id: productId },
          },
          product_price: 0, // El precio se inicializa en 0 y se actualizará más adelante
          product_quantity: quantity,
        },
      });
    }

    // Buscar el producto para obtener su precio
    const product = await this.prisma.product.findUnique({
      where: { product_id: productId },
    });

    // Si el producto no se encuentra, lanzar un error
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Calcular el precio total del producto basado en la cantidad y actualizar el carrito
    const productTotalPrice = product.value * quantity;

    await this.prisma.cart.update({
      where: { cart_id: cart.cart_id },
      data: { cart_total_price: { increment: productTotalPrice } },
    });
  }

  
  async getCartInfo(userId: number): Promise<CartDisplayDto[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cart: { user_id: userId } },
      include: {
        product: {
          include: {
            Size_Amount: true, // Incluye la relación Size_Amount
          },
        },
      },
    });

    const cartToReturn = cartItems.map(item => ({
      product_id: item.product_id,
      product_price: item.product.value,
      quantity: item.product_quantity,
      size_available: item.product.Size_Amount.size_amount, // Accede a la propiedad size_amount
      image_url: item.product.image_url,
    }));

    console.log(cartToReturn);
  
    return cartToReturn

  }
  
  
  

}
