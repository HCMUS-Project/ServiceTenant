import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()

export class CategoryService {
  constructor(private prismaService: PrismaService){}
  async create(createCategoryDto: CreateCategoryDto) {
    try{
      return await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
          description: createCategoryDto.description,
        },
      });
    }
    catch(error){
      if (error.code === 'P2002') {
        // Ví dụ: Xử lý lỗi khi trường unique không hợp lệ
        throw new Error('Category name exists. Please choose another name.');
      }

      // Nếu có lỗi khác, bạn có thể đơn giản trả về một thông báo lỗi tổng quát
      throw new Error('Can not create caterogy. Please try again.');
    }
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
