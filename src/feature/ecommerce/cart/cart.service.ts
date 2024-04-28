import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService
        , private ProductService: ProductService
    ) {}

    async create(createCartDto: CreateCartDto) {
        try {
            // Check quantities of product have to be greater than quantity of product database
            for (let i = 0; i < createCartDto.products_id.length; i++) {
                const product = await this.ProductService.findOne(createCartDto.products_id[i], createCartDto.domain);
                if (product.quantity < createCartDto.quantities[i]) {
                    throw new HttpException(`Quantity of product ${product.name} is not enough`, HttpStatus.BAD_REQUEST);
                }
            }

            const cartExists = await this.prismaService.cart.findFirst({
                where: {
                    domain: createCartDto.domain,
                    user_id: createCartDto.user_id,
                },
            });
    
            // Nếu giỏ hàng đã tồn tại, trả về thông báo lỗi
            if (cartExists !== null) {
                throw new HttpException('Cart already exists. Please update the cart instead.', HttpStatus.BAD_REQUEST);
            }
        
            // Tạo giỏ hàng mới
            const cart = await this.prismaService.cart.create({
                data: {
                    domain: createCartDto.domain,
                    user_id: createCartDto.user_id,
                    total_price: await this.calculateTotalPrice(createCartDto.products_id, createCartDto.quantities),
                    // Tạo các mục giỏ hàng từ dữ liệu DTO
                    cartItems: {
                        create: createCartDto.products_id.map((productId, index) => ({
                            product: { connect: { id: productId } }, // Kết nối với sản phẩm đã tồn tại trong hệ thống
                            quantity: createCartDto.quantities[index], // Số lượng của sản phẩm
                        })),
                    },
                },
                include: {
                    cartItems: true, // Bao gồm cả thông tin về các mục giỏ hàng được tạo
                },
            });
    
            return cart; // Trả về giỏ hàng đã được tạo
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findById(id: string, domain: string) {
        try {
            return this.prismaService.cart.findMany(
                {
                    where: {
                        id: id,
                        domain: domain,
                    },
                    include: {
                        cartItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findByUserId(user_id: string, domain: string) {
        try {
            return this.prismaService.cart.findUnique({
                where: {
                    unique_cart_domain_user_id: {
                        user_id: user_id,
                        domain: domain,
                    },
                },
                include: {
                    cartItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(id: string, updateCartDto: UpdateCartDto) {
        try {
            const { user_id, domain, products_id, quantities } = updateCartDto;
            for (let i = 0; i < products_id.length; i++) {
                const product = await this.ProductService.findOne(products_id[i], domain);
                if (product.quantity < quantities[i]) {
                    throw new HttpException(`Quantity of product ${product.name} is not enough`, HttpStatus.BAD_REQUEST);
                }
            }
    
            // Cập nhật thông tin của giỏ hàng
            const updatedCart = await this.prismaService.cart.update({
                where: { id },
                data: {
                    user_id,
                    domain,
                    // Xóa tất cả các mục giỏ hàng cũ và thêm lại các mục mới từ DTO
                    cartItems: {
                        deleteMany: {},
                        create: products_id.map((productId, index) => ({
                            product: { connect: { id: productId } },
                            quantity: quantities[index],
                        })),
                    },
                },
                // Bao gồm thông tin về các mục giỏ hàng đã được tạo lại
                include: {
                    cartItems: true,
                },
            });
    
            return updatedCart;
        } catch (error) {
            throw new Error(error.message);
        }
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

    async calculateTotalPrice(productIds: string[], quantities: number[]): Promise<number> {
        try {
            // Khởi tạo tổng giá là 0
            let totalPrice: number = 0;

            // Duyệt qua từng productId và tính giá cho từng sản phẩm
            for (let i = 0; i < productIds.length; i++) {
                // Lấy giá của sản phẩm từ productService
                const price = await this.ProductService.getPriceOfProduct(productIds[i]);

                // Tính tổng giá dựa trên giá của sản phẩm và số lượng
                totalPrice = Number(totalPrice) + Number(price) * quantities[i];
            }

            return totalPrice;
        } catch (error) {
          throw new Error('Failed to calculate total price. Please try again.');
        }
      }
}
