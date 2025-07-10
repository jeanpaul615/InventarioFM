import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ReturnsService } from "../services/returns.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("returns")
@UseGuards(JwtAuthGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get()
  findAll() {
    return this.returnsService.findAll();
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    // Extraer solo el nombre del material si viene con " (Stock: ...)"
    let material = body.material;
    if (typeof material === "string" && material.includes(" (Stock:")) {
      material = material.split(" (Stock:")[0].trim();
    }
    // Llama al servicio con el nombre limpio
    return this.returnsService.create({
      ...body,
      material,
      // fecha se asigna en el servicio
    });
  }
}