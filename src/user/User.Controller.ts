import { Body, Controller, Get, Post, Delete, Param } from "@nestjs/common";
import { UserService } from "./User.Service";
import { User } from "@prisma/client";

@Controller('https://backendapp-production-5383.up.railway.app/api/submit-form')
export class UserController{

    constructor(private readonly userService: UserService){}

    @Post()//Decorador
    async createUser(@Body() data: User) {
        return this.userService.createUser(data)
    }

    @Get()
    async getAllUsers(){
        return this.userService.getAllUsers()
    }

    @Delete(':id')
    async deleteUser(@Param(':id') id:string ){
        return this.userService
    }
//@Delete(':id')
//async deleteTask(@Param('id') id:string) {
}