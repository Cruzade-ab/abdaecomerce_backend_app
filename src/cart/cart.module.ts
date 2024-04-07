import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AddToCartDto, CartItemDto } from 'src/dto/cart-item.dto';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [PrismaModule, CartItemDto, AddToCartDto]
})
export class CartModule {}
