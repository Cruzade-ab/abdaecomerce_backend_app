import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralProductDTO } from '../dto/products_dto/product_dto';


@Injectable()
export class ProductsService {
    
    constructor(private readonly prisma: PrismaService) {}

    async sendProducts(): Promise<GeneralProductDTO[]> {
        
        return null;
        
        
        
    }
}
