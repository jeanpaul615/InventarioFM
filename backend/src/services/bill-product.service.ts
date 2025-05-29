import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillProduct } from '../entities/bill-product.entity';

@Injectable()
export class BillProductService {
  constructor(
    @InjectRepository(BillProduct)
    private billProductRepository: Repository<BillProduct>,
  ) {}

  create(data: Partial<BillProduct>) {
    const billProduct = this.billProductRepository.create(data);
    return this.billProductRepository.save(billProduct);
  }

  findAll() {
    return this.billProductRepository.find({ relations: ['bill', 'product'] });
  }

  findOne(id: number) {
    return this.billProductRepository.findOne({ where: { id }, relations: ['bill', 'product'] });
  }
}