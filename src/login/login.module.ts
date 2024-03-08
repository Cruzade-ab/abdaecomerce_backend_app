import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [PrismaModule, JwtModule.register({secret: 'tuClaveSecreta', signOptions: {expiresIn: '1h'}})]
})
export class LoginModule {}