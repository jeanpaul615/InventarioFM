import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Crear usuario CRISTIAN BRAN si no existe
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);
  const exists = await userRepo.findOneBy({ username: 'CRISTIAN BRAN' });
  if (!exists) {
    const hash = await bcrypt.hash('12345', 10);
    const user = userRepo.create({ username: 'CRISTIAN BRAN', password: hash, role: 'admin' });
    await userRepo.save(user);
    console.log('Usuario CRISTIAN BRAN creado');
  }
  await app.listen(8000);
}
bootstrap();