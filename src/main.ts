import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { config as loadEnv } from 'dotenv';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  loadEnv();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const whitelist = ['http://localhost:4200'];

  const corsOptions: CorsOptions = {
    origin: whitelist,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      exceptionFactory: (errors) => {
        const validationErrors = errors.map((error) => ({
          field: error.property, // Get the property name
          errors: Object.values(error.constraints), // Get the error messages
        }));
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Не удалось создать модель',
          validationErrors, // Return the structured validation errors
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logStartupMessage();
}

function logStartupMessage() {
  const env = process.env.NODE_ENV || 'development';
  const message = `🚀 Приложение работает в режиме: ${env.toUpperCase()}`;

  const styledMessage =
    env === 'development' ? message : env === 'production' ? message : message;

  console.log(styledMessage);
}

bootstrap();
