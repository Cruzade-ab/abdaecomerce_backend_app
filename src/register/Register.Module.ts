import { Module } from "@nestjs/common";
import { RegisterController } from "./Register.Controller";
import { RegisterService } from "./Register.Service";
import { PrismaModule } from "src/prisma/prisma.module";
@Module({
    controllers:[RegisterController],
    providers: [RegisterService],
    imports: [PrismaModule]
})
export class RegisterModule {}