import { Controller, Post, Body} from '@nestjs/common';
import { AdminOperationsService } from './admin-operations.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralProductDTO } from '../dto/products_dto/product_dto';

@Controller('admin-operations')
export class AdminOperationsController {
  constructor(private readonly adminOperationsService: AdminOperationsService, private readonly prismaService: PrismaService) {}

    @Post('createProduct')
    async createProduct( productData: ProductDTO): Promise<any>{
      
    }
      
}
  
