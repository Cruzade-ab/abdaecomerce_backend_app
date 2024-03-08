import { Controller, Injectable, Post, Body} from '@nestjs/common';
import { RegisterService } from './register.service';
import { User } from '@prisma/client';

@Injectable()
@Controller('api')
export class RegisterController {

    constructor(private readonly registerService: RegisterService) {}

   @Post('register')
    async createUser(@Body() data: User) {
        return this.registerService.createUser(data);
      }

    
}
