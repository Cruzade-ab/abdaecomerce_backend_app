
import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./User.Service";
import { User } from "@prisma/client";

@Controller('/api/submit-form') 
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() data: User) {
        data['role_id'] = 1
        console.log(data)

        return this.userService.createUser(data);
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

}