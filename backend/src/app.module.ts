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
import { Quotation } from './entities/quotation.entity';
import { QuotationProduct } from './entities/quotation-product.entity';
import { QuotationService } from './services/quotation.service';
import { QuotationController } from './controllers/quotation.controller';
import { AuthModule } from './modules/auth.module';
import { AuthController } from './controllers/auth.controller';
import { InventoryLog } from './entities/inventory-log.entity';
import { InventoryLogService } from './services/inventory-log.service';
import { InventoryLogController } from './controllers/inventory-log.controller';
import { Return } from './entities/returns.entity'; 
import { ReturnsService } from './services/returns.service';
import { ReturnsController } from './controllers/returns.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Product, Bill, BillProduct, Customer, Quotation, QuotationProduct, InventoryLog, Return], 
      logging: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, BillProduct, Bill, Customer, Quotation, QuotationProduct, InventoryLog, Return]),
    AuthModule,
  ],
  controllers: [AppController, ProductController, BillController, BillProductController, CustomerController, QuotationController, AuthController, InventoryLogController, ReturnsController], 
  providers: [AppService, ProductService, BillProductService, BillService, CustomerService, QuotationService, InventoryLogService, ReturnsService],
  exports: [TypeOrmModule],
})
export class AppModule {}