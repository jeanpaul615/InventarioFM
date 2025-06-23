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
    userId: number | null,
    tipo?: 'nuevo' | 'suma',
  ) {
    let usuario: User | null = null;
    if (userId) {
      usuario = await this.userRepo.findOneBy({ id: userId });
    }
    // Si no se envía tipo, por defecto es 'suma'
    const tipoFinal = tipo && tipo.length > 0 ? tipo : 'suma';
    const log = this.logRepo.create({ material, cantidad, tipo: tipoFinal, ...(usuario ? { usuario } : {}) });
    return this.logRepo.save(log);
  }

  async findAll() {
    return this.logRepo.find({ relations: ['usuario'], order: { fecha: 'DESC' } });
  }
}
