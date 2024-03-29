import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PrismaModule } from './prisma/prisma.module';



@Module({
  imports: [UserModule, ProductsModule, AdminModule, CloudinaryModule, PrismaModule],
})
export class AppModule {}
