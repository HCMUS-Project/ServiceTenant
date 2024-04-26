import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {AccessTokenGuard} from 'src/common/guards/token/accessToken.guard';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get('search')
  search(@Query() query: { name?: string; category?: string }) {
    const { name, category } = query;

    if (name && category) {
      // Trường hợp cả name và category được chỉ định
      return this.productService.searchByNameAndCategory(name, category);
    } else if (name) {
      // Trường hợp chỉ có name được chỉ định
      return this.productService.searchByName(name);
    } else if (category) {
      // Trường hợp chỉ có category được chỉ định
      return this.productService.searchByCategory(category);
    } else {
      // Trường hợp không có tham số nào được chỉ định
      return this.productService.findAll();
    }
  }
}
