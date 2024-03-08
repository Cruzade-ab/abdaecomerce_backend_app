// import { Controller, Injectable, Post, Body, Res, Get, Req} from '@nestjs/common';
// import { UserService } from './user.service';
// import { User } from '@prisma/client';
// import { Response, Request } from 'express';

// @Injectable()
// @Controller('api/user')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   // crear usuario
// //   @Post('register')
// //   async createUser(@Body() data: User) {
// // 	return this.userService.createUser(data);
// //   }

//   // logear usuario
//   @Post('login')
//     async logUser(@Body() data: User, @Res({passthrough: true}) res: Response) {
//         return this.userService.logUser(data, res);
//     }

// 	// Obtener usuario del token
// 	@Get('getUser')
//     async getUser(@Req() request: Request) {
//         return this.userService.getUserFromToken(request);
//     }

//     // Hacer logout del usuario.
//     @Post('logout')
//     async logoutUser(@Res({passthrough: true}) response: Response) {
//         return this.userService.logoutUser(response);
//     }

//     @Get('AllUsers')
//     async getAllUsers(){
//         return this.userService.getAllUsers();
//     }

// }
