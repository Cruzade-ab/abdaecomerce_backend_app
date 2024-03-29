import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { AdminController } from './admin/admin.controller';
import { ProductsController } from './products/products.controller';
import { UserService } from './user/user.service';
import { AdminService } from './admin/admin.service';
import { ProductsService } from './products/products.service';


@Module({
  imports: [UserModule, ProductsModule, AdminModule, CloudinaryModule, PrismaModule],
  controllers: [UserController, AdminController, ProductsController, ],
  providers: [ UserService, AdminService, ProductsService],
})
export class AppModule {}
