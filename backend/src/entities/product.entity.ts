import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BillProduct } from './bill-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_comercial: number;

  // @Column('decimal', { precision: 10, scale: 2 })
  // valor_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lista_1: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lista_2: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lista_3: number;

  @Column('int')
  cantidad: number;

  @Column({ nullable: true, default: 'und' })
  unidad: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => BillProduct, billProduct => billProduct.product)
  billProducts: BillProduct[];
}