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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as XLSX from 'xlsx';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(xlsx|xls)$/)) {
        return cb(new Error('Solo se permiten archivos Excel'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<any> {
    if (!file) {
      throw new HttpException({ message: 'No se subió ningún archivo' }, HttpStatus.BAD_REQUEST);
    }
    // Procesar el archivo Excel
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(sheet);
    // Filtra/elimina la columna valor_unitario si existe
    data = data.map((row: any) => {
      const { valor_unitario, ...rest } = row;
      return rest;
    });
    // Obtener userId del formData si viene (para carga masiva)
    let userId = req.body?.userId || req.user?.userId || null;
    if (typeof userId === 'string') userId = parseInt(userId);
    await this.productService.bulkCreate(data, userId);
    return { message: 'Archivo procesado y productos cargados correctamente' };
  }

  @Patch(':id/decrement-stock')
  async decrementStock(@Param('id') id: number, @Body('quantity') quantity: number) {
    try {
      return await this.productService.decrementStock(id, quantity);
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/add-stock')
  async addStock(
    @Param('id') id: number,
    @Body('quantity') quantity: number,
    @Body('userId') userIdFromBody: number,
    @Req() req: any
  ) {
    try {
      // Prioridad: userId del body (frontend), si no, del JWT
      const userId = userIdFromBody ?? req.user?.userId ?? null;
      return await this.productService.addStock(id, quantity, userId);
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
}