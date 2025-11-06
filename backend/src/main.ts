import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

async function bootstrap() {
 const app = await NestFactory.create(AppModule); // <--- NO uses FastifyAdapter aquí

  

  // Configurar CORS para permitir peticiones desde cualquier origen en red local
  app.enableCors({
    origin: true, // Permitir todos los orígenes (ideal para red local)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.listen(8000, '0.0.0.0');
  console.log('');
  console.log('🚀 Backend iniciado correctamente');
  console.log('📍 Local: http://localhost:8000');
  console.log('🌐 Red: http://0.0.0.0:8000');
  console.log('✅ CORS habilitado para todos los orígenes');
  console.log('');
}
bootstrap();