import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserOperationsService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    // Método para extraer el token JWT de la solicitud
    async extractTokenFromRequest(request: Request): Promise<string | null> {
        const cookie = request.cookies['token'];
        return cookie || null;
    }

    // Método para verificar la validez del token JWT
    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new UnauthorizedException('Token JWT inválido');
        }
    }

    // Método para obtener información del usuario basada en el token JWT
    async getUserFromToken(request: Request): Promise<User | undefined> {
        // Extrae el token JWT de la solicitud
        const token = await this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException('Token JWT no encontrado');
        }

        // Verifica y decodifica el token JWT
        const decoded = await this.verifyToken(token);

        // Si el token no es válido o no contiene el correo electrónico, lanza una excepción
        if (!decoded  || !decoded.email) {
            throw new UnauthorizedException('Token JWT inválido');
        }

        // Busca al usuario en la base de datos por su correo electrónico
        return this.prisma.user.findUnique({
            where: {
                email: decoded.email 
            } 
        });
    }

    // get all users
    async getAllUsers(){
        try {
            const users = await this.prisma.user.findMany();
            return users;
        } catch (error) {
            console.error("Error retrieving users:", error);
            throw error;
        }
    }
}
