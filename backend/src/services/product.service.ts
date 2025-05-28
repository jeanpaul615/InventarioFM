import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  create(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async update(id: number, product: Product): Promise<Product> {
    await this.productRepository.update(id, product);
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (!updatedProduct) {
      throw new Error(`Product with id ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async bulkCreate(products: any[]): Promise<void> {
    try {
      const productEntities = products.map((row) => {
        const product = new Product();
        product.nombre = row.nombre;
        product.valor_comercial = row.valor_comercial;
        product.valor_unitario = row.valor_unitario;
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
}