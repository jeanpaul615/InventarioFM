import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { BillProduct } from './bill-product.entity';
import { Customer } from './customer.entity';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => BillProduct, billProduct => billProduct.bill)
  billProducts: BillProduct[];

  @ManyToOne(() => Customer, { eager: true })
  customer: Customer;
}