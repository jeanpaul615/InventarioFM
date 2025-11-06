import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    const userRepo = AppDataSource.getRepository(User);
    
    // Verificar usuarios existentes
    const allUsers = await userRepo.find();
    console.log('Usuarios existentes:', allUsers.map(u => ({ id: u.id, username: u.username, role: u.role })));

    // Crear usuario admin si no existe
    const exists = await userRepo.findOneBy({ username: 'CRISTIAN BRAN' });
    
    if (!exists) {
      const hash = await bcrypt.hash('12345', 10);
      const user = userRepo.create({ 
        username: 'CRISTIAN BRAN', 
        password: hash, 
        role: 'admin' 
      });
      await userRepo.save(user);
      console.log('✓ Usuario CRISTIAN BRAN creado exitosamente');
    } else {
      console.log('✓ Usuario CRISTIAN BRAN ya existe');
    }

    await AppDataSource.destroy();
    console.log('Proceso completado');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
