import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, UserService, PrismaService],
  imports: [PrismaModule, UserModule, JwtModule.register({secret: 'tuClaveSecreta', signOptions: {expiresIn: '1h'}})]

})
export class OrderModule {}
