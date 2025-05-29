import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BillProductService } from '../services/bill-product.service';
import { BillProduct } from '../entities/bill-product.entity';

@Controller('bill-products')
export class BillProductController {
  constructor(private readonly billProductService: BillProductService) {}

  @Post()
  create(@Body() data: Partial<BillProduct>) {
    return this.billProductService.create(data);
  }

  @Get()
  findAll() {
    return this.billProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.billProductService.findOne(id);
  }
}