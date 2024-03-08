import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/shared_module/shared_module';
@Module({
  imports: [SharedModule],
  providers: [PrismaService]
})
export class LoginModule {}