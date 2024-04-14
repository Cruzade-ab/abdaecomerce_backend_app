import { Injectable } from '@nestjs/common';
import { Order } from 'src/dto/order-list';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class OrderService {

  constructor(private readonly prisma: PrismaService) {}

  async create(order: Order) {
    return 'This action adds a new order';
  }

  
}
