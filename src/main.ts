import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const port = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
        origin: ["http://localhost:3000" , "https://abda-ecomerce-frontend-bigk-git-abimael-abimael-santas-projects.vercel.app"],
        credentials: true,
        methods: ["POST", "GET", "DELETE", "PUT"],
        allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'], 
        exposedHeaders: ['Authorization']
  });


  await app.listen(port, "0.0.0.0");
  console.log("Server is running on port", port);
  console.log("Hello, world!");
}
bootstrap();
