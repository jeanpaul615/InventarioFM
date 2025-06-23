import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

async function bootstrap() {
 const app = await NestFactory.create(AppModule); // <--- NO uses FastifyAdapter aquí

  

  // Configurar CORS para permitir peticiones desde el puerto 3000
  app.enableCors({
    origin: 'http://localhost:3000', // Permitir peticiones desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permitir envío de cookies si es necesario
  });

  await app.listen(8000, '0.0.0.0');
}
bootstrap();