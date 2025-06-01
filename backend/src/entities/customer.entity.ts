import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Caracterizacion {
  LISTA_1 = 'lista_1',
  LISTA_2 = 'lista_2',
  LISTA_3 = 'lista_3',
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({
    type: 'text', // Cambia de 'enum' a 'text'
    default: Caracterizacion.LISTA_1,
  })
  caracterizacion: Caracterizacion;
}