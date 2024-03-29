import { Injectable, Controller } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Controller('api/admin')
@Injectable()
export class AdminController {
    constructor(private readonly prisma: PrismaService) {}

    
}