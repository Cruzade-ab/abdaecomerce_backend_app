import { Module } from "@nestjs/common";
import { UserController } from "./User.Controller";
import { UserService } from "./User.Service";
import {PrismaModule} from "src/Prisma/prisma.module"
@Module({
    controllers:[UserController],
    providers: [UserService],
    imports: [PrismaModule]
})
export class UserModule {}