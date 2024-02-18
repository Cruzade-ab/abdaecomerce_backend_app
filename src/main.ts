import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
        origin: "http://localhost:3000" || '*',
        credentials: true,
        methods: "Get, Post, , Put, Delete",
        allowedHeaders: "*", 
        preflightContinue: true,
  });
  await app.listen(3000);
}
bootstrap();
