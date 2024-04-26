import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { Decimal } from '@prisma/client/runtime/library';

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
        },
      });
      
      const productCategories = createProductDto.category_id.map((categoryId) => {
        return this.prismaService.productCategory.create({
          data: {
            productId: product.id,
            categoryId: categoryId,
          },
        });
      })
      await this.prismaService.$transaction(productCategories);
      
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const newData: any = { ...updateProductDto };
  
      if (Array.isArray(updateProductDto.image)) {
        const imageLink = await this.supabaseService.uploadImageAndGetLink(updateProductDto.image);
        newData.image = { set: imageLink };
      }
  
      const updatedProduct = await this.prismaService.product.update({
        where: { id },
        data: newData,
      });
  
      return updatedProduct;
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
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

  async searchByNameAndCategory(name: string, category: string): Promise<any[]> {
    try {
      // Find the category ID based on the category name
      const categoryInfo = await this.prismaService.category.findUnique({
        where: {
          name: category,
        },
      });
  
      if (!categoryInfo) {
        // If the category doesn't exist, return an empty array
        return [];
      }
  
      // Find products that match the name and are associated with the category
      const products = await this.prismaService.product.findMany({
        where: {
          name: {
            contains: name,
          },
          categories: {
            some: {
              categoryId: categoryInfo.id,
            },
          },
        },
      });
  
      return products;
    } catch (error) {
      // Handle errors
      throw new Error(`Error searching products: ${error}`);
    }
  }
  

  async searchByName(name: string): Promise<any[]> {
    try {
      const products: any[] = await this.prismaService.product.findMany({
        where: {
          name: {
            contains: name,
          },
        },
      });
      return products;
    } catch (error) {
      throw new Error('Failed to search products by name. Please try again.');
    }
  }

  async searchByCategory(category: string): Promise<any[]> {
    try {
      // Find the category ID based on the category name
      const categoryInfo = await this.prismaService.category.findUnique({
        where: {
          name: category,
        },
      });
  
      if (!categoryInfo) {
        // If the category doesn't exist, return an empty array
        return [];
      }

      const products = await this.prismaService.product.findMany({
        where: {
          categories: {
            some: {
              categoryId: categoryInfo.id,
            },
          },
        },
      });
      return products;
    } catch (error) {
      throw new Error('Failed to search products by category. Please try again.');
    }
  }
  
  async getPriceOfProduct(productId: string): Promise<Decimal> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id: productId,
        },
      });

      return product.price;
    } catch (error) {
      throw new Error('Failed to get price of product. Please try again.');
    }
  }
}
