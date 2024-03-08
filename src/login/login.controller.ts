import { Controller } from '@nestjs/common';
import {Post, Body, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoginService } from './login.service';
import {Response, response} from 'express'

@Controller('api')
export class LoginController {
    
    constructor (private readonly loginService: LoginService) {}

    @Post('login')
    async logUser(@Body() data: User, @Res({passthrough: true}) res: Response) {
        return this.loginService.logUser(data, res);
    }

    @Post('logout')
    async logOutUser(@Res({passthrough: true}) response: Response) {
        return this.loginService.logOutUser(response);
    }
}
