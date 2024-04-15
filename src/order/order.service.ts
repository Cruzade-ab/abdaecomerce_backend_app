import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderForm } from 'src/dto/order-list';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) { }

  async createOrder(userId: number, orderForm: OrderForm): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {
      const address = await prisma.adress.create({
        data: {
          user_id: userId,
          adress: orderForm.address,
          city: orderForm.city,
          state: orderForm.state,
          zip_code: orderForm.zip_code
        }
      });

      console.log('Address Created: ', address);

      const cartItems = await prisma.cartItem.findMany({
        where: { cart: { user_id: userId } },
        include: { product: true }
      });

      if (cartItems.length === 0) {
        throw new HttpException('No cart items found', HttpStatus.BAD_REQUEST);
      }

      const order = await prisma.order.create({
        data: {
          address_id: address.adress_id,
          user_id: userId,
          purchased_products: 0,
          order_total: 0,
        },
      });

      let totalOrderPrice = 0;
      let totalProducts = 0;

      for (const item of cartItems) {
        let size_Amount = await prisma.size_Amount.findUnique({
          where: { size_amount_id: item.product.size_amount_id }
        });

        if (!size_Amount) {
          throw new HttpException('SizeAmount Stock not found', HttpStatus.NOT_FOUND);
        }

        await prisma.size_Amount.update({
          where: { size_amount_id: item.product.size_amount_id },
          data: { size_amount: { decrement: item.product_quantity } },
        });

        await prisma.product_Order.create({
          data: {
            order_id: order.order_id,
            product_id: item.product_id,
            product_quantity: item.product_quantity,
            product_total: item.product.value * item.product_quantity,
          },
        });

        totalOrderPrice += item.product.value * item.product_quantity;
        totalProducts += item.product_quantity;
      }

      await prisma.order.update({
        where: { order_id: order.order_id },
        data: { order_total: totalOrderPrice, purchased_products: totalProducts },
      });

      await prisma.cart.update({
        where: { user_id: userId },
        data: {
          cartItems: { deleteMany: {} },
          cart_total_price: 0
        },
      });

      console.log("Orden procesada Exitosamente: ", order);

      const user = await this.prisma.user.findUnique({
        where: { user_id: userId }
      })

      const emailContent = `
        <h1>Order Confirmation</h1>
        <p>Your order with the ID #123456 has been successfully processed.</p>
        <p>Details:</p>
        <ul>
          <li>Item: Example Product</li>
          <li>Quantity: 2</li>
          <li>Total Price: $100</li>
        </ul>
        <p>Thank you for your purchase!</p>
      `;

      const emailSent = await this.mailService.send(

        user.email,  // Email address (To: )

        'New Order Notification',  // Subject of the email

        emailContent  // HTML content of the email

      );

      if (!emailSent) {
        console.error('Failed to send order notification email to admin.');
        // Handle the failure case appropriately
      }


      return order;
    }).catch((error) => {
      throw new HttpException(`Failed to process order: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
