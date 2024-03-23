import { Module } from '@nestjs/common';
import { AdminOperationsService } from './admin-operations.service';
import { AdminOperationsController } from './admin-operations.controller';
import { SharedModule } from 'src/shared_module/shared_module';

@Module({
  controllers: [AdminOperationsController, SharedModule],
  providers: [AdminOperationsService],
})
export class AdminOperationsModule {}
