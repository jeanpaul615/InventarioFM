import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { Bill } from './entities/bill.entity';
import { BillProduct } from './entities/bill-product.entity';
import { BillService } from './services/bill.service';
import { BillProductService } from './services/bill-product.service';
import { BillController } from './controllers/bill.controller'; 
import { BillProductController } from './controllers/bill-product.controller'; 
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Product, Bill, BillProduct], 
      logging: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, BillProduct, Bill]),
  ],
  controllers: [AppController, ProductController, BillController, BillProductController], 
  providers: [AppService, ProductService, BillProductService, BillService],
  exports: [TypeOrmModule],
})
export class AppModule {}