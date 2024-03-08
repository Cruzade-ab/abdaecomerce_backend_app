import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserOperationsController } from 'src/user-operations/user-operations.controller';
import { UserOperationsService } from 'src/user-operations/user-operations.service';
import { LoginController } from 'src/login/login.controller';
import { LoginService } from 'src/login/login.service';
import { RegisterController } from 'src/register/register.controller';
import { RegisterService } from 'src/register/register.service';

@Module({
  controllers: [UserOperationsController, RegisterController, LoginController],
  providers: [UserOperationsService, RegisterService, LoginService],
  imports: [PrismaModule, JwtModule.register({secret: 'tuClaveSecreta', signOptions: {expiresIn: '1h'}})]
})
export class SharedModule {}