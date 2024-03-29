import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [UserModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
