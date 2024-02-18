import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
        origin: process.env.CORS_ALLOWED_ORIGIN || '*',
        credentials: true,
        methods: "Get, Post, , Put, Delete",
        allowedHeaders: "*", 
        preflightContinue: true,
  });
  await app.listen(3000);
}
bootstrap();
