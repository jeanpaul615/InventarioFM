import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quotation } from './quotation.entity';
import { Product } from './product.entity';

@Entity()
export class QuotationProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quotation, quotation => quotation.quotationProducts)
  quotation: Quotation;

  @ManyToOne(() => Product)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
