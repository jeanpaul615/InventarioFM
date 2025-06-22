import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { InventoryLogService } from '../services/inventory-log.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('inventory-log')
@UseGuards(JwtAuthGuard)
export class InventoryLogController {
  constructor(private readonly logService: InventoryLogService) {}

  @Post()
  async logIngreso(@Body() body: { material: string; cantidad: number }, @Req() req: any) {
    const userId = req.user?.userId;
    return this.logService.logIngreso(body.material, body.cantidad, userId);
  }

  @Get()
  async findAll() {
    return this.logService.findAll();
  }
}
