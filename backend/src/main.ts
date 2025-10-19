import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');
  
  // Habilitar CORS
  app.enableCors();
  
  // Habilitar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Prefix: /api`);
  console.log(`🔗 Auth: http://localhost:${port}/api/auth/login`);
}

bootstrap();
