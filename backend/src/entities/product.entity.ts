import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_comercial: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lista_1: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lista_2: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lista_3: number;

  @Column('int')
  cantidad: number;
}