import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  material: string;

  @Column('int')
  cantidad: number;

  @Column({ type: 'varchar', default: 'suma' })
  tipo: 'nuevo' | 'suma'; // 'nuevo' para producto nuevo, 'suma' para suma al inventario

  @ManyToOne(() => User, { eager: true })
  usuario: User;
}
