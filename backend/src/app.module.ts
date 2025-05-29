import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { BillProductService } from './services/bill-product.service';
import { ProductController } from './controllers/product.controller';
import { BillProductController } from './controllers/bill-product.controller';
import { Factura } from './entities/bill.entity';
import { FacturaProducto } from './entities/bill-product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Product, FacturaProducto, Factura],
      logging: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, FacturaProducto, Factura]),
  ],
  controllers: [AppController, ProductController, BillProductController],
  providers: [AppService, ProductService, BillProductService],
  exports: [TypeOrmModule],
})
export class AppModule {}

