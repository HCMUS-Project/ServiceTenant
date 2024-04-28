import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService) {}

    async create(createCartDto: CreateCartDto) {
        const { user_id, products, total_price } = createCartDto;
        try {
            console.log(products); // Debug to see the actual product data

            // Mapping the products to ensure product_id is defined
            const productData = products.map(product => {
                console.log(product); // Further check each product
                return {
                    product_id: product.id, // Make sure this field is named correctly in ProductDto
                    quantity: product.quantity,
                };
            });

            const cart = await this.prismaService.cart.create({
                data: {
                    domain: createCartDto.domain,
                    user_id: user_id,
                    total_price: total_price,
                    status: 'pending',
                    cartItems: {
                        create: productData,
                    },
                },
            });

            return cart;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw new Error(error.message);
        }
    }

    findAll() {
        try {
            return this.prismaService.cart.findMany();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    findOne(id: string) {
        try {
            return this.prismaService.cart.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(id: string, updateCartDto: UpdateCartDto) {
        // Kiểm tra xem giỏ hàng có tồn tại hay không
        const existingCart = await this.prismaService.cart.findUnique({
            where: { id },
            include: { cartItems: true },
        });

        if (!existingCart) {
            throw new Error('Cart not found');
        }

        // Cập nhật giỏ hàng
        const updatedCart = await this.prismaService.cart.update({
            where: { id },
            data: {
                total_price: updateCartDto.total_price,
                status: updateCartDto.status,
                cartItems: {
                    // Xóa tất cả các sản phẩm hiện tại
                    deleteMany: {},
                    // Thêm các sản phẩm mới
                    create: updateCartDto.products?.map(p => ({
                        product_id: p.product_id,
                        quantity: p.quantity,
                    })),
                },
            },
        });

        return updatedCart;
    }

    remove(id: string) {
        try {
            return this.prismaService.cart.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error('Failed to delete cart. Please try again.');
        }
    }
}
