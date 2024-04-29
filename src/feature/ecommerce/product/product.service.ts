import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
    constructor(
        private prismaService: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const imageLink = await this.supabaseService.uploadImageAndGetLink(
                createProductDto.image,
            );
            const product = await this.prismaService.product.create({
                data: {
                    domain: createProductDto.domain,
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

            // Tạo mới các bản ghi trong bảng ProductCategory
            const productCategories = [];
            for (const categoryId of createProductDto.categories_id) {
                const category = await this.prismaService.category.findUnique({
                    where: {
                        id: categoryId,
                    },
                    select: {
                        name: true,
                    },
                });

                if (!category) {
                    throw new Error(`Category with ID ${categoryId} not found`);
                }

                // Tạo mới một bản ghi trong bảng ProductCategory với trường name lấy từ category
                const productCategory = this.prismaService.productCategory.create({
                    data: {
                        productId: product.id,
                        categoryId: categoryId,
                        name: category.name,
                    },
                });

                productCategories.push(productCategory);
            }

            // Thực hiện tạo mới các bản ghi trong bảng ProductCategory trong một giao dịch
            await this.prismaService.$transaction(productCategories);

            return product;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Product name exists. Please choose another name.');
            }

            throw new Error(error.message);
        }
    }

    async findAll(domain: string) {
        try {
            return await this.prismaService.product.findMany(
                // Include domain
                {
                    where: {
                        domain: domain,
                    },
                    include: {
                        categories: {
                            select: {
                                categoryId: true,
                                name: true,
                            },
                        },
                    },
                },
            );
        } catch (error) {
            throw new Error('Failed to fetch products. Please try again.');
        }
    }

    async findOne(id: string, domain: string) {
        try {
            return await this.prismaService.product.findUnique({
                where: {
                    id: id,
                    domain: domain,
                },
                include: {
                    categories: {
                        select: {
                            categoryId: true,
                            name: true,
                        },
                    },
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
                const imageLink = await this.supabaseService.uploadImageAndGetLink(
                    updateProductDto.image,
                );
                newData.image = imageLink;
            }
            newData.updated_at = new Date();
            newData.category_id = undefined;
            const updatedProduct = await this.prismaService.product.update({
                where: { id: id, domain: updateProductDto.domain },
                data: newData,
            });

            if (updateProductDto.categories_id !== undefined) {
                const currentProductCategories = await this.prismaService.productCategory.findMany({
                    where: {
                        productId: id,
                    },
                    select: {
                        categoryId: true,
                    },
                });

                const currentCategoryIds = currentProductCategories.map(
                    category => category.categoryId,
                );

                // Lặp qua danh sách category mới từ dữ liệu gửi tới
                await Promise.all(
                    updateProductDto.categories_id.map(async categoryId => {
                        // Nếu categoryId không tồn tại trong danh sách category hiện tại, tạo mới
                        if (!currentCategoryIds.includes(categoryId)) {
                            await this.prismaService.productCategory.create({
                                data: {
                                    productId: id,
                                    categoryId: categoryId,
                                },
                            });
                        }
                    }),
                );

                // Xác định và xoá các category không được gửi lên
                const categoriesToDelete = currentCategoryIds.filter(
                    categoryId => !updateProductDto.categories_id.includes(categoryId),
                );
                await Promise.all(
                    categoriesToDelete.map(async categoryId => {
                        await this.prismaService.productCategory.deleteMany({
                            where: {
                                AND: [
                                    {
                                        productId: id,
                                    },
                                    {
                                        categoryId: categoryId,
                                    },
                                ],
                            },
                        });
                    }),
                );
            }

            return updatedProduct;
        } catch (error) {
            console.log('Failed to update product:', error);
            // Thông báo lỗi sẽ được trả về cho client
            throw new Error('Failed to update product. Error: ' + error.message);
        }
    }

    remove(id: string, domain: string) {
        try {
            return this.prismaService.product.delete({
                where: {
                    id: id,
                    domain: domain,
                },
            });
        } catch (error) {
            throw new Error('Failed to delete product. Please try again.');
        }
    }

    async searchWithFilters(
        filters: { name?: string; category?: string; price?: number; rating?: number },
        domain: string,
    ): Promise<any[]> {
        const { name, category, price, rating } = filters;

        let productsQuery = await this.prismaService.product.findMany({
            where: {
                domain: domain,
            },
        });

        // Áp dụng bộ lọc nếu có
        if (name) {
            productsQuery = productsQuery.filter(product => product.name.includes(name));
        }
        
        if (category) {
          const categoryId = await this.findCategoryIdByName(category);
          if (categoryId) {
              // Lấy danh sách productId từ bảng ProductCategory
              const productIds = await this.prismaService.productCategory.findMany({
                  where: {
                      categoryId: categoryId,
                  },
                  select: {
                      productId: true,
                  },
              });
      
              // Lọc ra các productId có trong productQuery
              const validProductIds = productIds.map(pc => pc.productId).filter(productId =>
                  productsQuery.some(product => product.id === productId)
              );
      
              // Lấy các sản phẩm có productId trong danh sách validProductIds
              productsQuery = await this.prismaService.product.findMany({
                  where: {
                      id: {
                          in: validProductIds,
                      },
                  },
              });
          }
      }
        

        if (price) {
          productsQuery = productsQuery.filter(product => {
            const priceDiff = Math.abs(Number(product.price) - price);
            const priceDiffPercentage = (priceDiff / price) * 100;
            return priceDiffPercentage <= 20;
          }
          );
        }

        if (rating) {
          productsQuery = productsQuery.filter(product => Number(product.rating) >= rating);
        }

        // Trả về kết quả
        return productsQuery;
    }

    async findCategoryIdByName(categoryName: string): Promise<string | null> {
      const category = await this.prismaService.category.findFirst({
        where: {
          name: categoryName,
        },
        select: {
          id: true,
        },
      });
  
      return category ? category.id : null;
    }

    async increaseProductViews(productId: string): Promise<void> {
        try {
            await this.prismaService.product.update({
                where: {
                    id: productId,
                },
                data: {
                    views: {
                        increment: 1,
                    },
                },
            });
        } catch (error) {
            throw new Error('Failed to increase product views. Please try again.');
        }
    }

    // write function add quantity of product
    async addProductQuantity(productId: string, quantity: number): Promise<void> {
        try {
            await this.prismaService.product.update({
                where: {
                    id: productId,
                },
                data: {
                    quantity: {
                        increment: quantity,
                    },
                },
            });
        } catch (error) {
            throw new Error('Failed to add product quantity. Please try again.');
        }
    }

    async updateProductSold(productId: string, quantity: number): Promise<void> {
        try {
            await this.prismaService.product.update({
                where: {
                    id: productId,
                },
                data: {
                    quantity: {
                        decrement: quantity,
                    },
                    sold: {
                        increment: quantity,
                    },
                },
            });
        } catch (error) {
            throw new Error('Failed to decrease product quantity. Please try again.');
        }
    }

    async updateProductRating(productId: string, rating: number): Promise<void> {
        try {
            const product = await this.prismaService.product.findUnique({
                where: {
                    id: productId,
                },
                select: {
                    rating: true,
                    number_rating: true,
                },
            });

            await this.prismaService.product.update({
                where: {
                    id: productId,
                },
                data: {
                    rating: Number((Number(product.rating) * Number(product.number_rating)) + rating)/(Number(product.number_rating) + 1),
                    number_rating: {
                        increment: 1,
                    }
                },
            });
        } catch (error) {
            throw new Error('Failed to update product rating. Please try again.');
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