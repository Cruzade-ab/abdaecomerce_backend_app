import { Controller } from '@nestjs/common';
import { AdminOperationsService } from './admin-operations.service';

@Controller('admin-operations')
export class AdminOperationsController {
  constructor(private readonly adminOperationsService: AdminOperationsService) {}
}
