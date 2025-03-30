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
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as XLSX from 'xlsx';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
  
  @Post('upload')
  async uploadFile(@Req() req: FastifyRequest): Promise<string> {
    if (!req.isMultipart()) {
      throw new HttpException(
        'Unsupported Media Type',
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
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Procesar el archivo (por ejemplo, leer un archivo Excel)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    return `Archivo procesado exitosamente. Se encontraron ${rows.length} filas.`;
  }
}