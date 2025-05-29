import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BillProduct } from './bill-product.entity';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => BillProduct, billProduct => billProduct.bill)
  billProducts: BillProduct[];
}