import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client'; 
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

    // createUser
    async createUser(data: User): Promise <User> {

        data['role_id'] = 1;
        const hashed_password = await bycrypt.hash(data.password, 12);
        data.password = hashed_password;

        return this.prisma.user.create({data});
    }

    //logUser
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
    }

    // validateUser
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
    }

    //Generar Token
    async createToken(user: User): Promise <string> {
        // Elimina la contraseña del usuario del objeto antes de firmar el token
        const { password, ...userWithoutPassword } = user;
        return this.jwtService.signAsync(userWithoutPassword);
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

    // Método para cerrar la sesión del usuario y limpiar la cookie de token
    async logoutUser(response: Response): Promise<any> {
        response.clearCookie('token');
        return { message: 'Éxito' };
    }


}
