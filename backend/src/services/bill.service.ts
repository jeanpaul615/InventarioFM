import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { Customer } from '../entities/customer.entity';
import { BillProduct } from '../entities/bill-product.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(BillProduct)
    private readonly billProductRepository: Repository<BillProduct>,
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

  async removeProductFromBill(billId: number, productId: number) {
    // Busca el BillProduct correspondiente
    const billProduct = await this.billProductRepository.findOne({
      where: {
        bill: { id: billId },
        product: { id: productId },
      },
      relations: ['bill', 'product'],
    });
    if (!billProduct) {
      // No lanzar error, solo responder con mensaje
      return { message: 'Producto no encontrado en la factura', notFound: true };
    }
    await this.billProductRepository.remove(billProduct);
    return { message: 'Producto eliminado de la factura' };
  }

  async updateProductQuantityInBill(billId: number, productId: number, newQuantity: number): Promise<BillProduct> {
    const billProduct = await this.billProductRepository.findOne({
      where: {
        bill: { id: billId },
        product: { id: productId },
      },
      relations: ['bill', 'product'],
    });

    if (!billProduct) {
      throw new Error('Producto no encontrado en la factura');
    }

    billProduct.quantity = newQuantity;
    return this.billProductRepository.save(billProduct);
  }

  async finalizeBill(billId: number) {
    const bill = await this.billRepository.findOne({ where: { id: billId } });
    if (!bill) throw new Error('Factura no encontrada');
    bill.finalizada = true;
    return this.billRepository.save(bill);
  }
}