import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BillService } from '../services/bill.service';
import { Bill } from '../entities/bill.entity';

@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  create(@Body() data: Partial<Bill> & { customer: number }) {
    return this.billService.create(data);
  }

  @Get()
  findAll() {
    return this.billService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.billService.findOne(Number(id));
  }

  @Delete(':billId/products/:productId')
  async removeProductFromBill(
    @Param('billId', ParseIntPipe) billId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.billService.removeProductFromBill(billId, productId);
  }
}