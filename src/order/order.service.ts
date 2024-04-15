import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from 'src/dto/order-list';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, orderDto: Order): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {
      // Step 1: Create or update address
      const address = await prisma.({
        where: {
          // Assuming a unique combination to identify the address or logic to find an existing address
          adress_id: orderDto.address || undefined,
        },
        create: {
          user_id: userId,
          adress: orderDto.address,
          city: orderDto.city,
          state: orderDto.state,
          zip_code: orderDto.zip_code
        },
        update: {
          adress: orderDto.address,
          city: orderDto.city,
          state: orderDto.state,
          zip_code: orderDto.zip_code
        }
      });

      // Step 2: Create the order using the address ID
      const order = await prisma.order.create({
        data: {
          address_id: address.adress_id,
          user_id: userId,
          purchased_products: 0, // Will calculate later
          order_total: 0, // Initially zero, will update later
        },
      });

      let totalOrderPrice = 0;
      let totalProducts = 0;

      // Step 3: Handle each product in the order
      for (const item of orderDto.products) {
        const product = await prisma.product.findUnique({
          where: { product_id: item.product_id },
          rejectOnNotFound: true,
        });

        // Deduct the product stock
        await prisma.product.update({
          where: { product_id: item.product_id },
          data: { stock: { decrement: item.quantity } },
        });

        // Create product order link
        await prisma.productOrder.create({
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

      // Step 4: Finalize the order
      await prisma.order.update({
        where: { order_id: order.order_id },
        data: { order_total: totalOrderPrice, purchased_products: totalProducts },
      });

      // Optional Step 5: Clear the user's cart
      await prisma.cart.update({
        where: { user_id: userId },
        data: { cartItems: { deleteMany: {} } },
      });

      return order;
    }).catch((error) => {
      throw new HttpException(`Failed to process order: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}

