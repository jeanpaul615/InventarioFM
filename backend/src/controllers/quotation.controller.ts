import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { QuotationService } from '../services/quotation.service';

@Controller('quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  async create(@Body() data: { customer: number; products: { product: number; quantity: number; price: number }[] }) {
    try {
      return await this.quotationService.create(data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear la cotización',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.quotationService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener cotizaciones',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.quotationService.findOne(Number(id));
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener la cotización',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
