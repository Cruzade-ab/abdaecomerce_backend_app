import { Controller, Injectable, Post, Body, Res, Get, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Response, Request } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Injectable()
@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // crear usuario
  @Post('/register')
  @ApiBody({
    description: 'Register a new user',
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        role_id: { type: 'number' },
      },
      example: {
        name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role_id: 1,
      },
    },
  })
  @ApiOperation({
    description: 'Creates a new user.'
  })
  async createUser(@Body() data: User) {
    return this.userService.createUser(data);
  }

  // logear usuario
  @Post('/login')
    async logUser(@Body() data: User, @Res({passthrough: true}) res: Response) {
        return this.userService.logUser(data, res);
    }

	// Obtener usuario del token
	@Get('/getUser')
    async getUser(@Req() request: Request) {
        return this.userService.getUserFromToken(request);
    }

    // Hacer logout del usuario.
    @Post('/logout')
    async logoutUser(@Res({passthrough: true}) response: Response) {
        return this.userService.logoutUser(response);
    }

    @Get('/AllUsers')
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

}
