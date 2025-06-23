import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryLog } from '../entities/inventory-log.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class InventoryLogService {
  constructor(
    @InjectRepository(InventoryLog)
    private readonly logRepo: Repository<InventoryLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async logIngreso(
    material: string,
    cantidad: number,
    userId: number,
    tipo: 'nuevo' | 'suma' = 'suma',
  ) {
    const usuario = await this.userRepo.findOneBy({ id: userId });
    if (!usuario) throw new Error('Usuario no encontrado');
    const log = this.logRepo.create({ material, cantidad, usuario, tipo });
    return this.logRepo.save(log);
  }

  async findAll() {
    return this.logRepo.find({ relations: ['usuario'], order: { fecha: 'DESC' } });
  }
}
