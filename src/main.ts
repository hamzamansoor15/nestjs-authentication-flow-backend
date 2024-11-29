import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { CustomLogger } from './logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Create logger instance
  const logger = app.get(CustomLogger);
  
  // Apply global interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  
  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
