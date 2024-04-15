import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/dto/order-list';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';


@Controller('api/order/')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService
  ) {}

  @Post('orderConfirmation')
  async create(@Req() request: Request, @Res() response: Response, @Body() order: Order) {
    try {
      const user = await this.userService.getUserFromToken(request);
      if (!user) {
        return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
      }

      // Pass the user ID to the order service
      const orderConfirmation = await this.orderService.createOrder( user.user_id, order);
      
      return response.status(HttpStatus.OK).json({ message: 'Order Confirmed', order: orderConfirmation });
    } catch (error) {
      console.error("Error confirming Order:", error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

