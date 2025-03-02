import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  valor_comercial: number;

  @Column('decimal')
  valor_unitario: number;

  @Column('int', { nullable: true })
  lista_1: number;

  @Column('int', { nullable: true })
  lista_2: number;

  @Column('int', { nullable: true })
  lista_3: number;

  @Column('int')
  cantidad: number;
}