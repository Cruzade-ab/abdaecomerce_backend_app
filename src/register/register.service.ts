import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client'; 
import * as bycrypt from 'bcrypt';

@Injectable()
export class RegisterService {

    constructor(private readonly prisma: PrismaService) {}

    async createUser(data: User): Promise <User> {

        data['role_id'] = 1;
        const hashed_password = await bycrypt.hash(data.password, 12);
        data.password = hashed_password;

        return this.prisma.user.create({data});
    }
}
