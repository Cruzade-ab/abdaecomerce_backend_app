import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/dto/order-list';

@Controller('api/order/')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orderConfirmation')
  async create(@Body() order:  Order ) {
    return this.orderService.create(order);
  }

}
