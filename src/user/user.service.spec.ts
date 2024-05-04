import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { Response} from 'express'; // Importación de Response y Request de Express

// Testing del user Service
// Testing del UserController
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService; // Asegúrate de definir prismaService aquí

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'claveSecretaDePrueba',
          signOptions: { expiresIn: '1h' },
        }),
        // Importa otros módulos necesarios aquí
      ],
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockImplementation((userData) => Promise.resolve(userData)),
              // Añade aquí otros métodos simulados según sea necesario
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation((user) => Promise.resolve('tokenSimulado')),
            verifyAsync: jest.fn().mockImplementation((token) => Promise.resolve({ email: 'test@example.com' })),
            // Añade aquí otros métodos simulados de JwtService según sea necesario
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService); // Usa userService en lugar de service
    prismaService = module.get<PrismaService>(PrismaService); // Inicializa prismaService 
  });

  it('debe crear un usuario y devolver los datos del usuario creado', async () => {
    const userData: User = {
      user_id: 1, // Un valor numérico para el ID del usuario
      name: 'Nombre', // Un valor de cadena para el nombre del usuario
      last_name: 'Apellido', // Un valor de cadena para el apellido del usuario
      email: 'test@example.com', // Un valor de cadena para el correo electrónico del usuario
      password: 'password', // Un valor de cadena para la contraseña del usuario
      role_id: 1, // Un valor numérico para el ID del rol del usuario
    };
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const expectedUserData = { ...userData, password: hashedPassword };
    // Simula la función 'create' del servicio Prisma para que devuelva una promesa resuelta con 'expectedUserData'
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(expectedUserData);


    const result = await userService.createUser(userData);
    expect(result).toEqual(expectedUserData);
  });// Final cuerpo Testing User

  it('should log in a user and return a success message', async () => {
    const mockData: User = {
      user_id: 1,
      name: 'Test',
      last_name: 'User',
      email: 'user@example.com',
      password: 'securePassword',
      role_id: 1,
    };
  
    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  
    // Make sure userService.logUser is called and properly awaited
    jest.spyOn(userService, 'logUser').mockImplementation(async () => {
      mockResponse.cookie('token', 'fakeToken', { httpOnly: true });
      return { message: 'Logged Successfully!' };
    });
  
    const result = await userController.logUser(mockData, mockResponse);
  
    // Ensure all spies/mocks are called as expected
    expect(userService.logUser).toHaveBeenCalledWith(mockData, mockResponse);
    expect(result).toEqual({ message: 'Logged Successfully!' });
    expect(mockResponse.cookie).toHaveBeenCalledWith('token', expect.any(String), { httpOnly: true });
  });
  

}); 
