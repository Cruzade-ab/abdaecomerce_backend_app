import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa JwtModule
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';
import { RegisterService } from './register/register.service';
import { PrismaService } from './prisma/prisma.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { UserOperationsController } from './user-operations/user-operations.controller';
import { UserOperationsModule } from './user-operations/user-operations.module';
import { UserOperationsService } from './user-operations/user-operations.service';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdminOperationsService } from './admin-operations/admin-operations.service';
import { AdminOperationsController } from './admin-operations/admin-operations.controller';


@Module({
  imports: [
    RegisterModule,
    LoginModule,
    UserOperationsModule,
    JwtModule.register({
      secret: 'your_secret_key', // Configura la clave secreta para JwtModule
      signOptions: { expiresIn: '1h' }, // Opcional: Configura las opciones de firma JWT
    }),
    ProductsModule,
    CloudinaryModule,
    ConfigModule.forRoot()
  ],
  controllers: [RegisterController, LoginController, UserOperationsController, ProductsController, AdminOperationsController],
  providers: [RegisterService, PrismaService, LoginService, UserOperationsService, ProductsService, CloudinaryService, AdminOperationsService]
})
export class AppModule {}
