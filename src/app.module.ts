import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FilterModule } from './filter/filter.module';
import { SearchModule } from './search/search.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, 
  }),
  UserModule, ProductsModule, AdminModule, CloudinaryModule, PrismaModule, FilterModule, SearchModule],
})
export class AppModule {}
