import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared_module/shared_module';
@Module({
  imports: [SharedModule],
})
export class RegisterModule {}