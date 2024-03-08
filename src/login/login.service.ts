import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import {Response, Request, response} from 'express';


@Injectable()
export class LoginService {

    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

    // log user 
    async logUser(data: User, response: Response): Promise <any> {
        const user = await this.validateUser(data);

        if (!user) {
            throw new UnauthorizedException('Invalid Credentials.');
        }

        const token = await this.createToken(user);
        response.cookie('token', token, {
            httpOnly: true
        })

        return {
            message: 'Logged Successfully!'
        }
    } // end log user


    // validate user
    async validateUser(data: User): Promise <User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email
            }
        });

        if (!user || !(await bycrypt.compare(data.password, user.password))) {
            return null;
        }

        return user;
    } // end validate user
            

    // create token
    async createToken(user: User): Promise <string> {
        // eliminamos la constraseña del objeto user antes de firmar el token.
        const  {password, ...userWithoutPassword } = user;
        return this.jwtService.signAsync(userWithoutPassword);
    } // end create token

    // logout user
    async logOutUser(response: Response): Promise <any> {
        response.clearCookie('token');
        return {message: 'Logout Successfull.'}
    } // end logout user



} // end loginService
