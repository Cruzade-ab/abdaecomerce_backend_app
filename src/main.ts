import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
        origin: true,
        credentials: true,
        methods: ["POST", "GET", "DELETE", "PUT"],
        allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'], 
        exposedHeaders: ['Authorization']
        
  });
  await app.listen(3000);
}
bootstrap();
