import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService){}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prismaService.product.create({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
          quantity: createProductDto.quantity,
          tenant_id: createProductDto.tenant_id,
          description: createProductDto.description,
          views: createProductDto.views,
          rating: createProductDto.rating,
          category_id: createProductDto.category_id,
        },
      });
      console.log(product);
      return product;
    } catch (error) {
      // Xử lý các lỗi cụ thể nếu cần thiết
      if (error.code === 'P2002') {
        // Ví dụ: Xử lý lỗi khi trường unique không hợp lệ
        throw new Error('Product name exists. Please choose another name.');
      }

      // Nếu có lỗi khác, bạn có thể đơn giản trả về một thông báo lỗi tổng quát
      throw new Error('Can not create product. Please try again.');
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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
