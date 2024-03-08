import { Controller, Injectable, Get, Req, Query, UnauthorizedException } from '@nestjs/common';
import { UserOperationsService } from './user-operations.service';
import {Request} from 'express'

@Injectable()
@Controller('api/userOperations')
export class UserOperationsController {

    constructor( private readonly userOperationService: UserOperationsService) {}


    @Get('AllUsers') 
    async getAllUsers() {
        return this.userOperationService.getAllUsers();
    }

    @Get('getUser')
    async getUser(@Req() request: Request) {
        return this.userOperationService.getUserFromToken(request);
    }

    @Get('verifyToken')
    async verifyToken(@Query('token') token: string) {
        if (!token) {
            throw new UnauthorizedException('Token is is missing.');
        }

        return await this.userOperationService.verifyToken(token);
    } 

    @Get('extractToken')
    async extractTokenFromRequest(@Req() request) {
        try {
            const token = await this.userOperationService.extractTokenFromRequest(request);
            if (!token) {
                throw new UnauthorizedException('Token not found in request')
            }

            return token;
        }
        catch (error) {
            throw new UnauthorizedException('Failed to extract token from request.')
        }
    }
 }
