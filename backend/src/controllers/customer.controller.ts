import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() data: Partial<Customer>) {
    return this.customerService.create(data);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customerService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Customer>) {
    return this.customerService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.customerService.remove(Number(id));
  }
}