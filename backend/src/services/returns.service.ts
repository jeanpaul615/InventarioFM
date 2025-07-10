import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Return } from "../entities/returns.entity";
import { Product } from "../entities/product.entity";

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Return)
    private returnsRepository: Repository<Return>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll() {
    return this.returnsRepository.find({
      order: { fecha: "DESC" }
    });
  }

  async create(data: { material: string; cantidad: number; usuario: string }) {
    const ret = this.returnsRepository.create({
      ...data,
      fecha: new Date(),
    });
    await this.returnsRepository.save(ret);

    const nombreMaterial = data.material.split(" (Stock:")[0].trim();
    const product = await this.productsRepository.findOne({ where: { nombre: nombreMaterial } });
    if (product) {
      product.cantidad += data.cantidad;
      await this.productsRepository.save(product);
    }

    return ret;
  }
}