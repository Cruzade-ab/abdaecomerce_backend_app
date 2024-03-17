import { Module } from '@nestjs/common';
import { AdminOperationsService } from './admin-operations.service';
import { AdminOperationsController } from './admin-operations.controller';

@Module({
  controllers: [AdminOperationsController],
  providers: [AdminOperationsService],
})
export class AdminOperationsModule {}
