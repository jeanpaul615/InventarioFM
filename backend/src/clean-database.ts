import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { Bill } from './entities/bill.entity';
import { BillProduct } from './entities/bill-product.entity';
import { Quotation } from './entities/quotation.entity';
import { QuotationProduct } from './entities/quotation-product.entity';
import { InventoryLog } from './entities/inventory-log.entity';

async function cleanDatabase() {
  // Configuración de la base de datos (similar a la del app.module.ts)
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [
      User,
      Product,
      Customer,
      Bill,
      BillProduct,
      Quotation,
      QuotationProduct,
      InventoryLog,
    ],
    synchronize: false, // No sincronizar para evitar cambios en el esquema
  });

  try {
    // Conectar a la base de datos
    await dataSource.initialize();
    console.log('Conectado a la base de datos SQLite');

    // Obtener el query runner
    const queryRunner = dataSource.createQueryRunner();

    // Deshabilitar las foreign key constraints temporalmente
    await queryRunner.query('PRAGMA foreign_keys = OFF');

    console.log('Limpiando la base de datos (manteniendo usuarios)...');

    // Limpiar todas las tablas EXCEPTO user
    // Orden importante: primero las tablas que dependen de otras (foreign keys)
    
    // 1. Limpiar tablas de unión/relación primero
    await queryRunner.query('DELETE FROM bill_product');
    console.log('✓ Tabla bill_product limpiada');

    await queryRunner.query('DELETE FROM quotation_product');
    console.log('✓ Tabla quotation_product limpiada');

    // 2. Limpiar tablas principales
    await queryRunner.query('DELETE FROM inventory_log');
    console.log('✓ Tabla inventory_log limpiada');

    await queryRunner.query('DELETE FROM bill');
    console.log('✓ Tabla bill limpiada');

    await queryRunner.query('DELETE FROM quotation');
    console.log('✓ Tabla quotation limpiada');

    await queryRunner.query('DELETE FROM product');
    console.log('✓ Tabla product limpiada');

    await queryRunner.query('DELETE FROM customer');
    console.log('✓ Tabla customer limpiada');

    // Reiniciar los contadores de ID para las tablas limpiadas
    await queryRunner.query('DELETE FROM sqlite_sequence WHERE name != "user"');
    console.log('✓ Contadores de ID reiniciados (excepto para user)');

    // Rehabilitar las foreign key constraints
    await queryRunner.query('PRAGMA foreign_keys = ON');

    // Verificar cuántos usuarios permanecen
    const userCount = await queryRunner.query('SELECT COUNT(*) as count FROM user');
    console.log(`✓ Base de datos limpiada. ${userCount[0].count} usuario(s) conservado(s)`);

    await queryRunner.release();
    console.log('✅ Limpieza completada exitosamente');

  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error);
    throw error;
  } finally {
    // Cerrar la conexión
    await dataSource.destroy();
    console.log('Conexión cerrada');
  }
}

// Ejecutar el script
cleanDatabase()
  .then(() => {
    console.log('Script de limpieza ejecutado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error ejecutando el script:', error);
    process.exit(1);
  });
