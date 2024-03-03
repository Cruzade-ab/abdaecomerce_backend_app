import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
        origin: "https://abda-ecomerce-frontend-bigk-git-abimael-abimael-santas-projects.vercel.app",
        credentials: true,
        methods: ["POST", "GET", "DELETE", "PUT"],
        allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'], 
        exposedHeaders: ['Authorization']
  });

  await app.listen(port, "0.0.0.0")
}
bootstrap();
