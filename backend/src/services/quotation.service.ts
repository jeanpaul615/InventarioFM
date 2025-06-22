import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from '../entities/quotation.entity';
import { Customer } from '../entities/customer.entity';
import { QuotationProduct } from '../entities/quotation-product.entity';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(QuotationProduct)
    private quotationProductRepository: Repository<QuotationProduct>,
  ) {}

  async create(data: { customer: number; products: { product: number; quantity: number; price: number }[] }) {
    try {
      if (!data.customer) throw new BadRequestException('El cliente es obligatorio');
      if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
        throw new BadRequestException('Debe agregar al menos un producto');
      }
      const customer = await this.customerRepository.findOneBy({ id: data.customer });
      if (!customer) throw new NotFoundException('Cliente no encontrado');
      // Crear la cotización
      const quotation = this.quotationRepository.create({ customer });
      await this.quotationRepository.save(quotation);

      // Crear los productos de la cotización y asociarlos
      const quotationProducts: QuotationProduct[] = [];
      for (const p of data.products) {
        if (!p.product || !p.quantity || !p.price) {
          throw new BadRequestException('Datos de producto incompletos');
        }
        const product = { id: p.product } as any;
        const qp = this.quotationProductRepository.create({
          quotation,
          product,
          quantity: p.quantity,
          price: p.price,
        });
        quotationProducts.push(qp);
      }
      await this.quotationProductRepository.save(quotationProducts);

      // Devolver la cotización con productos y cliente
      return this.quotationRepository.findOne({
        where: { id: quotation.id },
        relations: ['quotationProducts', 'quotationProducts.product', 'customer'],
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error interno al crear la cotización');
    }
  }

  async findAll() {
    try {
      return await this.quotationRepository.find({
        relations: ['quotationProducts', 'quotationProducts.product', 'customer'],
        order: { date: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener cotizaciones');
    }
  }

  async findOne(id: number) {
    try {
      if (!id) throw new BadRequestException('ID inválido');
      const quotation = await this.quotationRepository.findOne({
        where: { id },
        relations: ['quotationProducts', 'quotationProducts.product', 'customer'],
      });
      if (!quotation) throw new NotFoundException('Cotización no encontrada');
      return quotation;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al obtener la cotización');
    }
  }
}
