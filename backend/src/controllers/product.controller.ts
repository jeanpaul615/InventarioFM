import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Req,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as XLSX from 'xlsx';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Req() req: any
  ): Promise<any> {
    try {
      // Paginación y filtro por nombre
      const page = parseInt(req.query?.page) || 1;
      const limit = parseInt(req.query?.limit) || 20;
      const search = req.query?.search || '';
      const result = await this.productService.findAllPaginated(page, limit, search);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Error al obtener productos' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    try {
      const product = await this.productService.findOne(id);
      return product;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Producto no encontrado' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  async create(@Body() product: Product, @Req() req: any): Promise<any> {
    try {
      // Extraer userId del request (JWT)
      const userId = req.user?.userId;
      const created = await this.productService.create(product, userId);
      return { message: 'Producto creado correctamente' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Error al crear producto' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() product: Product, @Req() req: any): Promise<any> {
    try {
      // Extrae el userId del token si está presente
      const userId = req.user?.userId;
      const updated = await this.productService.update(id, product, userId);
      return { message: 'Producto actualizado correctamente' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Error al actualizar producto' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    try {
      await this.productService.remove(id);
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Error al eliminar producto' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('upload')
  async uploadFile(@Req() req: any): Promise<any> {
    // Deshabilitado para evitar errores en scripts y pruebas
    throw new Error('Funcionalidad de upload deshabilitada temporalmente para mantenimiento.');
  }

  @Patch(':id/decrement-stock')
  async decrementStock(@Param('id') id: number, @Body('quantity') quantity: number) {
    try {
      return await this.productService.decrementStock(id, quantity);
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
}