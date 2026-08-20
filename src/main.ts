import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { AppModule } from './app.module';
import { ApiSecretGuard } from '../api-secret.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ensure upload directories exist
  const uploadDirs = ['./uploads/avatars', './uploads/evolution', './uploads/evaluations'];
  for (const dir of uploadDirs) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  // Serve uploaded files as static assets
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.enableCors({
    origin: [
      /^https?:\/\/([a-z0-9-]+\.)?tremtech\.dev\.br$/,
      'http://localhost:8080',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalGuards(new ApiSecretGuard());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application running on: http://localhost:${port}`);
}

bootstrap();
