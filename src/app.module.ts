import { Module } from '@nestjs/common';
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';
import { RegisterService } from './register/register.service';
import { PrismaService } from './prisma/prisma.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { UserOperationsController } from './user-operations/user-operations.controller';
import { UserOperationsModule } from './user-operations/user-operations.module';



@Module({
  imports: [RegisterModule, LoginModule, UserOperationsModule],
  controllers: [RegisterController, LoginController, UserOperationsController],
  providers: [RegisterService, PrismaService, LoginService]
})
export class AppModule {}
