import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Configuração de CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL, // URL do Frontend definida nas variáveis de ambiente
      /\.vercel\.app$/,         // Permite todos os subdomínios da Vercel (Preview e Produção)
    ].filter((origin) => !!origin) as (string | RegExp)[],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });

  // Habilitar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Prefix: /api`);
  console.log(`🔗 Auth: http://localhost:${port}/api/auth/login`);
}

bootstrap();
