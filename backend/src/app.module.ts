import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Bill } from './entities/bill.entity';
import { BillService } from './services/bill.service';
import { BillController } from './controllers/bill.controller'; 
import { BillProduct } from './entities/bill-product.entity';
import { BillProductService } from './services/bill-product.service';
import { BillProductController } from './controllers/bill-product.controller'; 
import { Customer } from './entities/customer.entity';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Product, Bill, BillProduct, Customer], 
      logging: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, BillProduct, Bill, Customer]),
  ],
  controllers: [AppController, ProductController, BillController, BillProductController, CustomerController], 
  providers: [AppService, ProductService, BillProductService, BillService, CustomerService],
  exports: [TypeOrmModule],
})
export class AppModule {}