import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
  ) {}

  create(data: Partial<Bill>) {
    const bill = this.billRepository.create(data);
    return this.billRepository.save(bill);
  }

  findAll() {
    return this.billRepository.find({ relations: ['billProducts'] });
  }

  findOne(id: number) {
    return this.billRepository.findOne({ where: { id }, relations: ['billProducts'] });
  }
}