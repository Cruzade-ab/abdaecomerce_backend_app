import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from 'src/dto/order-list';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';
import { SizeAmount, SizeAmountDTO } from 'src/dto/products_dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async createOrder(userId: number, orderDto: Order): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {

      // Step 1: Creamos una instancia en el Modelo Address
      const address = await prisma.adress.create({
        data: {
          user_id: userId,
          adress: orderDto.address,
          city: orderDto.city,
          state: orderDto.state,
          zip_code: orderDto.zip_code
        }
      });

      console.log('Address Created: ', address)

      // Step 2: Se crea una instancia de una orden con el id del address
      const order = await prisma.order.create({
        data: {
          address_id: address.adress_id,
          user_id: userId,
          purchased_products: 0, // Se inicializa para luego actualizar
          order_total: 0, // Se inicializa para luego actualizar
        },
      });

      let totalOrderPrice = 0;
      let totalProducts = 0;

      // Step 3: Iterar por cada producto de la orden
      for (const item of orderDto.products) {

        // Encuentra el producto especifico
        let product: Product;
        try {
          product = await prisma.product.findUnique({
            where: { product_id: item.product_id }
          });
          if (!product) {
            throw new Error('Product not found');
          }
        } catch (error) {
          throw new HttpException(`Product not found: ${error.message}`, HttpStatus.NOT_FOUND);
        }


        // Encuentra el Size_Amount relevante para el producto y la talla específica
        let size_Amount: SizeAmount;
        try {
          size_Amount = await prisma.size_Amount.findUnique({
            where: { size_amount_id: product.size_amount_id }
          });
          if (!size_Amount) {
            throw new Error('SizeAmount Stock not found');
          }
        } catch (error) {
          throw new HttpException(`SizeAmount Stock not found: ${error.message}`, HttpStatus.NOT_FOUND);
        }

        
        // Deduct the product stock
        await prisma.size_Amount.update({
          where: { size_amount_id: product.size_amount_id },
          data: { size_amount: { decrement: item.quantity } },
        });

        // Create product order link
        await prisma.product_Order.create({
          data: {
            order_id: order.order_id,
            product_id: item.product_id,
            product_quantity: item.quantity,
            product_total: item.product_price * item.quantity,
          },
        });

        totalOrderPrice += item.product_price * item.quantity;
        totalProducts += item.quantity;
      }

      // Step 4: Finalizar La orden
      await prisma.order.update({
        where: { order_id: order.order_id },
        data: { order_total: totalOrderPrice, purchased_products: totalProducts },
      });

      // Step 5: Clear the user's cart
      await prisma.cart.update({
        where: { user_id: userId },
        data: { cartItems: { deleteMany: {} } },
      });

      console.log("Orden procesada Exitosamente: ",order)
      return order;
    }).catch((error) => {
      throw new HttpException(`Failed to process order: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}

