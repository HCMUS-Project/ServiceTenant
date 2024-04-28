import { Body, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prismaService: PrismaService) {}
    async create(createCategoryDto: CreateCategoryDto) {
        try {
            return await this.prismaService.category.create({
                data: {
                    domain: createCategoryDto.domain,
                    name: createCategoryDto.name,
                    description: createCategoryDto.description,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                // Ví dụ: Xử lý lỗi khi trường unique không hợp lệ
                throw new Error('Category name exists. Please choose another name.');
            }

            // Nếu có lỗi khác, bạn có thể đơn giản trả về một thông báo lỗi tổng quát
            throw new Error('Can not create caterogy. Please try again.');
        }
    }

    findAll(domain: string) {
        if (!domain) {
            throw new Error('Domain is required.');
        }
        return this.prismaService.category.findMany({
            where: {
                domain: domain,
            },
        });
    }

    findOne(id: string, domain: string) {
        if (!domain) {
            throw new Error('Domain is required.');
        }
        return this.prismaService.category.findUnique({
            where: {
                domain: domain,
                id: id,
            },
        });
    }

    update(id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            return this.prismaService.category.update({
                where: { id: id, domain: updateCategoryDto.domain },
                data: {
                    ...updateCategoryDto,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Category name exists. Please choose another name.');
            }

            throw new Error('Can not update category. Please try again.');
        }
    }

    remove(id: string, domain: string) {
        return this.prismaService.category.delete({
            where: {
                domain: domain,
                id: id,
            },
        });
    }
}
