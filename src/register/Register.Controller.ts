
import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { RegisterService } from "./Register.Service";
import { User } from "@prisma/client";

@Controller('/api/register') 
export class RegisterController {

    constructor(private readonly registerService: RegisterService) {}

    @Post()
    async createUser(@Body() data: User) {
        data['role_id'] = 1 
        console.log(data)

        return this.registerService.createUser(data);
    }

    @Get()
    async getAllUsers() {
        return this.registerService.getAllUsers();
    }


}