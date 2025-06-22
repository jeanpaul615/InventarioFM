import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ where: { activo: true } });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, data);
    const updated = await this.customerRepository.findOneBy({ id });
    if (!updated) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    // Verifica si el cliente tiene facturas asociadas
    const bills = await this.customerRepository.manager.find('Bill', { where: { customer: { id } } });
    if (bills && bills.length > 0) {
      // Si tiene facturas, solo lo marca como inactivo
      await this.customerRepository.update(id, { activo: false });
      return;
    }
    // Si no tiene facturas, lo elimina físicamente
    await this.customerRepository.delete(id);
  }
}