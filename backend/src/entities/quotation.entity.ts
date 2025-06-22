import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { QuotationProduct } from './quotation-product.entity';

@Entity()
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => QuotationProduct, qp => qp.quotation, { cascade: true })
  quotationProducts: QuotationProduct[];

  @ManyToOne(() => Customer, { eager: true })
  customer: Customer;
}
