import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { InventoryLogService } from '../services/inventory-log.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('inventory-log')
@UseGuards(JwtAuthGuard)
export class InventoryLogController {
  constructor(private readonly logService: InventoryLogService) {}

  @Post()
  async logIngreso(
    @Body() body: { material: string; cantidad: number; tipo?: 'nuevo' | 'suma' },
    @Req() req: any
  ) {
    const userId = req.user?.userId;
    // Pasar tipo si viene en el body, si no, undefined
    return this.logService.logIngreso(body.material, body.cantidad, userId, body.tipo);
  }

  @Get()
  async findAll() {
    return this.logService.findAll();
  }
}
