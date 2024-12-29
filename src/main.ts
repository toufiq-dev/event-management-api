import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix('api');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription('API for managing Events, Attendees, and Registrations')
    .setVersion('1.0')
    .addTag('Event')
    .addTag('Attendee')
    .addTag('Registration')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  app.useLogger(logger);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
