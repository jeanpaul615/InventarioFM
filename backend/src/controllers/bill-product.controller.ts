import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.billProductService.remove(id);
  }
}