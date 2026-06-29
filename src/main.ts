import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ApiSecretGuard } from '../api-secret.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://zeni.embersolutions.com.br',
      'https://monitor.embersolutions.com.br',
      'http://localhost:8080',
      'http://localhost:5173'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalGuards(new ApiSecretGuard());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application running on: http://localhost:${port}`);
}

bootstrap();