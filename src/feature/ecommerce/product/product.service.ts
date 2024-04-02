import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService,
              private supabaseService: SupabaseService
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const imageLink = await this.supabaseService.uploadImageAndGetLink(createProductDto.image);
      const product = await this.prismaService.product.create({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
          quantity: createProductDto.quantity,
          tenant_id: createProductDto.tenant_id,
          description: createProductDto.description,
          image: imageLink,
          views: createProductDto.views,
          rating: createProductDto.rating,
          category_id: createProductDto.category_id,
        },
      });
      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Product name exists. Please choose another name.');
      }

      throw new Error(error.message);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.product.findMany();
    } catch (error) {
      throw new Error('Failed to fetch products. Please try again.');
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.product.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error('Failed to fetch product. Please try again.');
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updateResult = this.prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          name: updateProductDto.name,
          price: updateProductDto.price,
          quantity: updateProductDto.quantity,
          tenant_id: updateProductDto.tenant_id,
          description: updateProductDto.description,
          image: updateProductDto.image,
          views: updateProductDto.views,
          rating: updateProductDto.rating,
          category_id: updateProductDto.category_id,
        },
      });
      return updateResult
    } catch (error) {
      throw new Error(`Failed to update product, ${error.message}`)
    }
  }

  remove(id: string) {
    try {
      return this.prismaService.product.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error('Failed to delete product. Please try again.');
    }
  }
}
