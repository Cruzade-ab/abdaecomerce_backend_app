import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserOperationsController } from './user-operations.controller';
import { UserOperationsService } from './user-operations.service';
@Module({
  controllers: [UserOperationsController],
  providers: [UserOperationsService],
  imports: [PrismaModule, JwtModule.register({secret: 'tuClaveSecreta', signOptions: {expiresIn: '1h'}})]
})
export class UserOperationsModule {}