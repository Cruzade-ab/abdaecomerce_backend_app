
import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./User.Service";
import { User } from "@prisma/client";

@Controller('/api/submit-form') 
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() data: User) {
        return this.userService.createUser(data);
    }

}