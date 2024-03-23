import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { SharedModule } from 'src/shared_module/shared_module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CloudinaryModule, SharedModule,  ConfigModule.forRoot({isGlobal: true})],
  providers: [CloudinaryService]
})
export class CloudinaryModule {}
