import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Bill } from './bill.entity';
import { Product } from './product.entity';

@Entity()
export class BillProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, bill => bill.billProducts)
  bill: Bill;

  @ManyToOne(() => Product, product => product.billProducts)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;
}