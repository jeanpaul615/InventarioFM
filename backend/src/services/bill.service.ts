import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(data: Partial<Bill> & { customer: number }) {
    const bill = this.billRepository.create(data);
    if (data.customer) {
      const customer = await this.customerRepository.findOneBy({ id: data.customer });
      if (!customer) {
        throw new Error(`Customer with id ${data.customer} not found`);
      }
      bill.customer = customer;
    }
    return this.billRepository.save(bill);
  }

  findAll() {
    return this.billRepository.find({
      relations: [
        'billProducts',
        'billProducts.product', // <-- agrega esto aquí también
        'customer',
      ],
    });
  }

  async findOne(id: number) {
    return this.billRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'billProducts',
        'billProducts.product', // <-- ya está bien aquí
      ],
    });
  }
}