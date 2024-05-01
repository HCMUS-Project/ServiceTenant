import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    IAddProductQuantityRequest,
    IAddProductQuantityResponse,
    ICategory,
    ICreateProductRequest,
    ICreateProductResponse,
    IDeleteProductRequest,
    IDeleteProductResponse,
    IFindAllProductsRequest,
    IFindAllProductsResponse,
    IFindProductByIdRequest,
    IFindProductByIdResponse,
    IIncreaseProductViewRequest,
    IIncreaseProductViewResponse,
    IProductResponse,
    ISearchProductsRequest,
    ISearchProductsResponse,
    IUpdateProductRequest,
    IUpdateProductResponse,
} from './interface/product.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { ProductCategory } from 'src/proto_build/e_commerce/productCategory_pb';
import { Prisma } from '@prisma/client';
import { filter } from 'rxjs';

@Injectable()
export class ProductService {
    constructor(
        private prismaService: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async create(dataRequest: ICreateProductRequest): Promise<ICreateProductResponse> {
        const { user, ...data } = dataRequest;
        // console.log(dataRequest)
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // check if product name already exists
            if (
                await this.prismaService.product.findFirst({
                    where: { name: data.name, domain: user.domain },
                })
            ) {
                throw new GrpcAlreadyExistsException('PRODUCT_ALREADY_EXISTS');
            }

            // create image
            // console.log(data.images)
            const imageLink = await this.supabaseService.uploadImageAndGetLink(data.images);
            // console.log(imageLink)

            // create product
            const newProduct = await this.prismaService.product.create({
                data: {
                    domain: user.domain,
                    name: data.name,
                    price: data.price,
                    quantity: data.quantity,
                    tenant_id: user.email,
                    description: data.description,
                    images: imageLink,
                    views: data.views,
                    rating: data.rating,
                    number_rating: data.numberRating,
                    sold: data.sold,
                },
            });

            // Tạo mới các bản ghi trong bảng ProductCategory
            const productCategories = [];
            const categoriesNameId = [];
            for (const categoryId of data.categories) {
                // console.log(categoryId)
                const category = await this.prismaService.category.findUnique({
                    where: {
                        id: categoryId,
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                });

                if (!category) {
                    throw new Error(`Category with ID ${categoryId} not found`);
                }

                // console.log(category)

                // Tạo mới một bản ghi trong bảng ProductCategory với trường name lấy từ category
                const productCategory = this.prismaService.productCategory.create({
                    data: {
                        productId: newProduct.id,
                        categoryId: categoryId,
                        name: category.name,
                    },
                });
                // console.log(productCategory)
                productCategories.push(productCategory);
                categoriesNameId.push({
                    id: category.id,
                    name: category.name,
                } as ICategory);
            }
            // console.log(productCategories)
            // Thực hiện tạo mới các bản ghi trong bảng ProductCategory trong một giao dịch
            await this.prismaService.$transaction(productCategories);

            return {
                ...newProduct,
                id: newProduct.id,
                tenantId: newProduct.tenant_id,
                numberRating: newProduct.number_rating,
                price: Number(newProduct.price),
                rating: Number(newProduct.rating),
                createdAt: newProduct.created_at.toString(),
                updatedAt: newProduct.updated_at.toString(),
                deletedAt: newProduct.deleted_at ? newProduct.deleted_at.toString() : null,
                categories: categoriesNameId,
            } as ICreateProductResponse;
        } catch (error) {
            throw error;
        }
    }

    async findAll(data: IFindAllProductsRequest): Promise<IFindAllProductsResponse> {
        try {
            // find all products by domain
            const products = await this.prismaService.product.findMany({
                where: { domain: data.user.domain },
                include: {
                    categories: {
                        select: {
                            categoryId: true,
                            name: true,
                        },
                    },
                },
            });

            return {
                products: products.map(product => ({
                    ...product,
                    tenantId: product.tenant_id,
                    numberRating: product.number_rating,
                    price: Number(product.price),
                    rating: Number(product.rating),
                    createdAt: product.created_at.toString(),
                    updatedAt: product.updated_at.toString(),
                    deletedAt: product.deleted_at ? product.deleted_at.toString() : null,
                    categories: product.categories.map(cateogry => ({
                        id: cateogry.categoryId,
                        name: cateogry.name,
                    })),
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async findOneById(data: IFindProductByIdRequest): Promise<IFindProductByIdResponse> {
        try {
            // find product by id and domain
            const product = await this.prismaService.product.findUnique({
                where: { domain: data.user.domain, id: data.id },
                include: {
                    categories: {
                        select: {
                            categoryId: true,
                            name: true,
                        },
                    },
                },
            });

            // check if category not exists
            if (!product) {
                throw new GrpcItemNotFoundException('Product');
            }

            return {
                ...product,
                tenantId: product.tenant_id,
                numberRating: product.number_rating,
                price: Number(product.price),
                rating: Number(product.rating),
                createdAt: product.created_at.toString(),
                updatedAt: product.updated_at.toString(),
                deletedAt: product.deleted_at ? product.deleted_at.toString() : null,
                categories: product.categories.map(cateogry => ({
                    id: cateogry.categoryId,
                    name: cateogry.name,
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async update(data: IUpdateProductRequest): Promise<IUpdateProductResponse> {
        const { user, id, categories, numberRating, ...dataUpdate } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            if (Array.isArray(dataUpdate.images)) {
                const imageLink = await this.supabaseService.uploadImageAndGetLink(
                    dataUpdate.images,
                );
                dataUpdate.images = imageLink;
            }

            // dataUpdate.updated_at = new Date();
            // dataUpdate.category_id = undefined;

            const updatedProduct = await this.prismaService.product.update({
                where: { id: id, domain: user.domain },
                data: {
                    ...dataUpdate,
                    number_rating: numberRating,
                },
            });

            if (categories !== undefined) {
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

                // Loop through the new category list from the incoming data
                await Promise.all(
                    categories.map(async categoryId => {
                        // If categoryId does not exist in the current category list, create a new one
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

                // Determine and delete categories not sent
                const categoriesToDelete = currentCategoryIds.filter(
                    categoryId => !categories.includes(categoryId),
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

            const newProduct = await this.prismaService.product.findUnique({
                where: { id: id, domain: user.domain },
                include: {
                    categories: {
                        select: {
                            categoryId: true,
                            name: true,
                        },
                    },
                },
            });

            return {
                ...newProduct,
                tenantId: newProduct.tenant_id,
                numberRating: newProduct.number_rating,
                price: Number(newProduct.price),
                rating: Number(newProduct.rating),
                createdAt: newProduct.created_at.toString(),
                updatedAt: newProduct.updated_at.toString(),
                deletedAt: newProduct.deleted_at ? updatedProduct.deleted_at.toString() : null,
                categories: newProduct.categories.map(category => ({
                    id: category.categoryId,
                    name: category.name,
                })),
            } as IUpdateProductResponse;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new GrpcItemNotFoundException('Product');
            } else {
                // If it's not a known Prisma error, rethrow the error
                throw error;
            }
        }
    }

    async remove(data: IDeleteProductRequest): Promise<IDeleteProductResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the product first
            const product = await this.prismaService.product.findUnique({
                where: { id: id, domain: user.domain },
            });

            // if the product does not exist, throw an error
            if (!product) {
                throw new GrpcItemNotFoundException('Product');
            }

            // delete product by id and domain
            const deletedProduct = await this.prismaService.product.delete({
                where: { id, domain: user.domain },
                include: {
                    categories: {
                        select: {
                            categoryId: true,
                            name: true,
                        },
                    },
                },
            });

            // check if product not exists
            if (!deletedProduct) {
                throw new GrpcItemNotFoundException('Product');
            }

            return {
                ...deletedProduct,
                tenantId: deletedProduct.tenant_id,
                numberRating: deletedProduct.number_rating,
                price: Number(deletedProduct.price),
                rating: Number(deletedProduct.rating),
                createdAt: deletedProduct.created_at.toString(),
                updatedAt: deletedProduct.updated_at.toString(),
                deletedAt: deletedProduct.deleted_at ? deletedProduct.deleted_at.toString() : null,
                categories: deletedProduct.categories.map(category => ({
                    id: category.categoryId,
                    name: category.name,
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async searchWithFilters(data: ISearchProductsRequest): Promise<ISearchProductsResponse> {
        const { user, ...filters } = data;

        let productsQuery = await this.prismaService.product.findMany({
            where: {
                domain: user.domain,
            },
            include: {
                categories: true, // Include categories
            },
        });

        // Apply filters if any
        if (filters.name) {
            productsQuery = productsQuery.filter(product => product.name.includes(filters.name));
        }

        if (filters.category) {
            const categoryId = await this.prismaService.category.findFirst({
                where: {
                    name: filters.category,
                },
                select: {
                    id: true,
                },
            });
            if (categoryId) {
                // Get list of productIds from ProductCategory table
                const productIds = await this.prismaService.productCategory.findMany({
                    where: {
                        categoryId: categoryId.id,
                    },
                    select: {
                        productId: true,
                    },
                });

                // Filter out productIds present in productQuery
                const validProductIds = productIds
                    .map(pc => pc.productId)
                    .filter(productId => productsQuery.some(product => product.id === productId));

                // Get products with productIds in validProductIds list
                productsQuery = await this.prismaService.product.findMany({
                    where: {
                        id: {
                            in: validProductIds,
                        },
                    },
                    include: {
                        categories: true, // Include categories
                    },
                });
            }
        }

        if (filters.minPrice) {
            productsQuery = productsQuery.filter(
                product => Number(product.price) >= Number(filters.minPrice),
            );
        }
        if (filters.maxPrice) {
            productsQuery = productsQuery.filter(
                product => Number(product.price) <= Number(filters.maxPrice),
            );
        }

        if (filters.rating) {
            productsQuery = productsQuery.filter(
                product => Number(product.rating) >= filters.rating,
            );
        }

        // Return the result
        return {
            products: productsQuery.map(product => ({
                ...product,
                tenantId: product.tenant_id,
                numberRating: product.number_rating,
                price: Number(product.price),
                rating: Number(product.rating),
                createdAt: product.created_at.toString(),
                updatedAt: product.updated_at.toString(),
                deletedAt: product.deleted_at ? product.deleted_at.toString() : null,
                categories: product.categories.map(cateogry => ({
                    id: cateogry.categoryId,
                    name: cateogry.name,
                })),
            })),
        };
    }

    async increaseView(data: IIncreaseProductViewRequest): Promise<IIncreaseProductViewResponse> {
        const { user, id } = data;

        // // check role of user
        // if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
        //     throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        // }

        try {
            // find the product first
            const product = await this.prismaService.product.findUnique({
                where: { id: id, domain: user.domain },
            });

            // if the product does not exist, throw an error
            if (!product) {
                throw new GrpcItemNotFoundException('Product');
            }

            // update product by id and domain in incresea view
            const newProduct = await this.prismaService.product.update({
                where: { id, domain: user.domain },
                data: {
                    views: {
                        increment: 1,
                    },
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

            // check if product not exists
            if (!newProduct) {
                throw new GrpcItemNotFoundException('Product');
            }

            return {
                ...newProduct,
                tenantId: newProduct.tenant_id,
                numberRating: newProduct.number_rating,
                price: Number(newProduct.price),
                rating: Number(newProduct.rating),
                createdAt: newProduct.created_at.toString(),
                updatedAt: newProduct.updated_at.toString(),
                deletedAt: newProduct.deleted_at ? newProduct.deleted_at.toString() : null,
                categories: newProduct.categories.map(category => ({
                    id: category.categoryId,
                    name: category.name,
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async addQuantity(data: IAddProductQuantityRequest): Promise<IAddProductQuantityResponse> {
        const { user, id, quantity } = data;

        // // check role of user
        // if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
        //     throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        // }

        try {
            // find the product first
            const product = await this.prismaService.product.findUnique({
                where: { id: id, domain: user.domain },
            });

            // if the product does not exist, throw an error
            if (!product) {
                throw new GrpcItemNotFoundException('Product');
            }

            // update product by id and domain in add quantity
            const newProduct = await this.prismaService.product.update({
                where: { id, domain: user.domain },
                data: {
                    quantity: {
                        increment: quantity,
                    },
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

            // check if product not exists
            if (!newProduct) {
                throw new GrpcItemNotFoundException('Product');
            }

            return {
                ...newProduct,
                tenantId: newProduct.tenant_id,
                numberRating: newProduct.number_rating,
                price: Number(newProduct.price),
                rating: Number(newProduct.rating),
                createdAt: newProduct.created_at.toString(),
                updatedAt: newProduct.updated_at.toString(),
                deletedAt: newProduct.deleted_at ? newProduct.deleted_at.toString() : null,
                categories: newProduct.categories.map(category => ({
                    id: category.categoryId,
                    name: category.name,
                })),
            };
        } catch (error) {
            throw error;
        }
    }
}
