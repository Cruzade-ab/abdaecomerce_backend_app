import { Module } from '@nestjs/common';
import { AdminOperationsService } from './admin-operations.service';
import { AdminOperationsController } from './admin-operations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [AdminOperationsController],
  providers: [AdminOperationsService, CloudinaryService],
})
export class AdminOperationsModule {}
