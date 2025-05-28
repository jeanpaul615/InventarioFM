import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  async findAll(): Promise<any> {
    try {
      const products = await this.productService.findAll();
      return products;
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
  async create(@Body() product: Product): Promise<any> {
    try {
      const created = await this.productService.create(product);
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
  async update(@Param('id') id: number, @Body() product: Product): Promise<any> {
    try {
      const updated = await this.productService.update(id, product);
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
  async uploadFile(@Req() req: FastifyRequest): Promise<any> {
    try {
      if (!req.isMultipart()) {
        throw new HttpException(
          { message: 'Tipo de archivo no soportado' },
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }

      const parts = req.parts();
      let fileBuffer: Buffer | null = null;

      for await (const part of parts) {
        if (part.type === 'file' && part.file) {
          const chunks: Buffer[] = [];
          for await (const chunk of part.file) {
            chunks.push(chunk);
          }
          fileBuffer = Buffer.concat(chunks);
        }
      }

      if (!fileBuffer) {
        throw new HttpException(
          { message: 'No se subió ningún archivo' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      await this.productService.bulkCreate(rows);

      return { message: 'Archivo procesado y productos guardados correctamente' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Error al procesar el archivo' },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}