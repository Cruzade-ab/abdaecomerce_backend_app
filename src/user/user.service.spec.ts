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
  let prismaService: PrismaService;
  let mockUsers: User[];

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn().mockResolvedValue(mockUsers),
        // Otros métodos simulados si es necesario
        create: jest.fn(),
      },
    };

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
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation((user) => Promise.resolve('tokenSimulado')),
            verifyAsync: jest.fn().mockImplementation((token) => Promise.resolve({ email: 'test@example.com' })),
            // Otros métodos simulados de JwtService si es necesario
          },
        },
      ],
    }).compile();
  
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeAll(() => {
    // Definimos mockUsers aquí
    mockUsers = [
      { user_id: 1, name: 'User 1', last_name: 'Last Name 1', email: 'user1@example.com', password: 'password1', role_id: 1 },
      { user_id: 2, name: 'User 2', last_name: 'Last Name 2', email: 'user2@example.com', password: 'password2', role_id: 1 },
      { user_id: 3, name: 'User 3', last_name: 'Last Name 3', email: 'user3@example.com', password: 'password3', role_id: 1 },
    ];
  });
  

  // Prueba del Register
  it('debe crear un usuario y devolver los datos del usuario creado', async () => {
    const userData: User = {
      user_id: 1,
      name: 'Nombre',
      last_name: 'Apellido',
      email: 'test@example.com',
      password: 'password',
      role_id: 1,
    };
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const expectedUserData = { ...userData, password: hashedPassword };

    // Configuración del mock para la función create del servicio Prisma
    (prismaService.user.create as jest.Mock).mockResolvedValue(expectedUserData);

    const result = await userService.createUser(userData);
    expect(result).toEqual(expectedUserData);
  }); // Final cuerpo Testing User

  // Prueba del log User
  it('Debe logear un usuario y devolver un mensaje de que se logró exitosamente.', async () => {
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
  }); // End Log user

  
  // Prueba Get All Users.
  it('Devuelve todos los usuarios registrados en la base de datos.', async () => {
    // Mock de la función findMany de PrismaService para devolver los usuarios de prueba
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

    // Llamada al método getAllUsers
    const users = await userService.getAllUsers();

    // Verificación de que se devuelvan todos los usuarios esperados
    expect(users).toEqual(mockUsers);
  }); // Cierre Get All Users.
  

  // Manejo de error en Get All Users.
  it('Maneja correctamente los errores al obtener usuarios.', async () => {
    // Mock de un error al obtener usuarios
    const errorMessage = 'Error obteniendo usuarios';
    jest.spyOn(prismaService.user, 'findMany').mockRejectedValue(new Error(errorMessage));

    // Verificación de que se maneje correctamente el error
    await expect(userService.getAllUsers()).rejects.toThrowError(errorMessage);
  }); // Cierre Manejo de error en Get All Users.
  

}); 
