import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { InventoryLogService } from './inventory-log.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly inventoryLogService: InventoryLogService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { activo: true } });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(product: Product, userId?: number): Promise<Product> {
    const createdProduct = await this.productRepository.save(product);
    // Registrar ingreso en InventoryLog si userId está presente
    if (userId) {
      await this.inventoryLogService.logIngreso(
        createdProduct.nombre,
        createdProduct.cantidad,
        userId,
      );
    }
    return createdProduct;
  }

  async update(id: number, product: Product, userId?: number): Promise<Product> {
    const before = await this.productRepository.findOneBy({ id });
    await this.productRepository.update(id, product);
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (!updatedProduct) {
      throw new Error(`Product with id ${id} not found`);
    }
    // Si la cantidad aumentó, registra el ingreso
    if (userId && before && updatedProduct.cantidad > before.cantidad) {
      await this.inventoryLogService.logIngreso(
        updatedProduct.nombre,
        updatedProduct.cantidad - before.cantidad,
        userId,
      );
    }
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    // Baja lógica: solo marca como inactivo
    await this.productRepository.update(id, { activo: false });
  }

  async bulkCreate(products: any[]): Promise<void> {
    try {
      const productEntities = products.map((row) => {
        const product = new Product();
        product.nombre = row.nombre;
        product.valor_comercial = row.valor_comercial;
        product.lista_1 = row.lista_1;
        product.lista_2 = row.lista_2;
        product.lista_3 = row.lista_3;
        product.cantidad = row.cantidad;
        return product;
      });

      await this.productRepository.save(productEntities);
      console.log('Productos guardados:', productEntities.length);
    } catch (error) {
      console.error('Error al guardar productos:', error);
      throw error;
    }
  }

  async decrementStock(productId: number, quantity: number) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) throw new Error('Producto no encontrado');
    if (product.cantidad < quantity) throw new Error('Stock insuficiente');
    product.cantidad -= quantity;
    return this.productRepository.save(product);
  }

  async findAllPaginated(page = 1, limit = 20, search = '') {
    const skip = (page - 1) * limit;
    const query = this.productRepository.createQueryBuilder('product').where(
      'product.activo = :activo',
      { activo: true },
    );
    if (search) {
      query.andWhere('LOWER(product.nombre) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }
    const [items, total] = await query
      .orderBy('product.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}