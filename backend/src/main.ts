import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3001);
  
  console.log('Backend rodando em http://localhost:3001/api');
  console.log('Rotas disponiveis:');
  console.log('   GET    /api/companies');
  console.log('   POST   /api/companies');
  console.log('   GET    /api/companies/:id');
  console.log('   PATCH  /api/companies/:id');
  console.log('   DELETE /api/companies/:id');
}

bootstrap();
