import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICartItem,
    ICartResponse,
    ICreateCartRequest,
    ICreateCartResponse,
    IDeleteCartRequest,
    IDeleteCartResponse,
    IFindAllCartsByUserIdRequest,
    IFindAllCartsByUserIdResponse,
    IFindCartByIdRequest,
    IFindCartByIdResponse,
    IUpdateCartRequest,
    IUpdateCartResponse,
} from './interface/cart.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { Role } from 'src/proto_build/auth/user_token_pb';
import {
    GrpcAlreadyExistsException,
    GrpcInvalidArgumentException,
    GrpcPermissionDeniedException,
} from 'nestjs-grpc-exceptions';
import { ProductService } from '../product/product.service';
import { IFindProductByIdRequest } from '../product/interface/product.interface';
import {
    IFindAllVouchersRequest,
    IFindAllVouchersResponse,
} from '../voucher/interface/voucher.interface';
import { GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';

@Injectable()
export class CartService {
    constructor(
        private prismaService: PrismaService,
        private productService: ProductService,
    ) {}

    async calculateTotalPrice(cartItems: ICartItem[]): Promise<number> {
        try {
            // Khởi tạo tổng giá là 0
            let totalPrice: number = 0;

            // Duyệt qua từng productId và tính giá cho từng sản phẩm
            for (let i = 0; i < cartItems.length; i++) {
                // Lấy giá của sản phẩm từ productService
                const product = await this.prismaService.product.findUnique({
                    where: {
                        id: cartItems[i].productId,
                    },
                });

                // Tính tổng giá dựa trên giá của sản phẩm và số lượng
                totalPrice = Number(totalPrice) + Number(product.price) * cartItems[i].quantity;
            }

            return totalPrice;
        } catch (error) {
            throw new Error('Failed to calculate total price. Please try again.');
        }
    }

    async create(dataRequest: ICreateCartRequest): Promise<ICreateCartResponse> {
        const { user, userId, cartItems } = dataRequest;
        // console.log(data)
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // console.log(cartItemsList)
            // Check quantities of product have to be greater than quantity of product database
            for (let i = 0; i < cartItems.length; i++) {
                const product = await this.productService.findOneById({
                    user: user,
                    id: cartItems[i].productId,
                });
                if (product.quantity < cartItems[i].quantity) {
                    throw new GrpcInvalidArgumentException('Product not enough');
                }
            }

            const cartExists = await this.prismaService.cart.findFirst({
                where: {
                    domain: user.domain,
                    user_id: userId,
                },
            });

            // console.log(cartExists)

            // Nếu giỏ hàng đã tồn tại, trả về thông báo lỗi
            if (cartExists !== null) {
                throw new GrpcAlreadyExistsException('Cart already exists');
            }

            // Tạo giỏ hàng mới
            const cart = await this.prismaService.cart.create({
                data: {
                    domain: user.domain,
                    user_id: userId,
                    total_price: await this.calculateTotalPrice(cartItems),
                    // Tạo các mục giỏ hàng từ dữ liệu DTO
                    cartItems: {
                        create: cartItems.map(cartItem => ({
                            product: { connect: { id: cartItem.productId } }, // Kết nối với sản phẩm đã tồn tại trong hệ thống
                            quantity: cartItem.quantity, // Số lượng của sản phẩm
                        })),
                    },
                },
                include: {
                    cartItems: true, // Bao gồm cả thông tin về các mục giỏ hàng được tạo
                },
            });

            return {
                cart: {
                    ...cart,
                    id: cart.id,
                    userId: cart.user_id,
                    cartItems: cart.cartItems.map(cartItem => ({
                        ...cartItem,
                        productId: cartItem.product_id,
                    })),
                    totalPrice: Number(cart.total_price),
                    createdAt: cart.created_at.toString(),
                    updatedAt: cart.updated_at.toString(),
                    deletedAt: cart.deleted_at ? cart.deleted_at.toString() : null,
                },
            }; // Trả về giỏ hàng đã được tạo
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findAllCarts(data: IFindAllCartsByUserIdRequest): Promise<IFindAllCartsByUserIdResponse> {
        try {
            // find all carts by domain and id
            const carts = await this.prismaService.cart.findMany({
                where: { domain: data.user.domain, user_id: data.userId },
                include: {
                    cartItems: {
                        select: {
                            product_id: true,
                            quantity: true,
                        },
                    },
                },
            });
            // console.log(carts)

            if (carts.length == 0) {
                throw new GrpcItemNotFoundException('Cart');
            }

            return {
                carts: carts.map(cart => ({
                    ...cart,
                    id: cart.id,
                    userId: cart.user_id,
                    cartItems: cart.cartItems.map(cartItem => ({
                        ...cartItem,
                        productId: cartItem.product_id,
                    })),
                    totalPrice: Number(cart.total_price),
                    createdAt: cart.created_at.toString(),
                    updatedAt: cart.updated_at.toString(),
                    deletedAt: cart.deleted_at ? cart.deleted_at.toString() : null,
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async findCartById(data: IFindCartByIdRequest): Promise<IFindCartByIdResponse> {
        const { user, userId } = data;
        try {
            // find cart by id and domain
            const cart = await this.prismaService.cart.findUnique({
                where: {
                    unique_cart_domain_user_id: {
                        user_id: userId,
                        domain: user.domain,
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

            // check if cart not exists
            if (!cart) {
                throw new GrpcItemNotFoundException('Cart');
            }

            return {
                cart: {
                    ...cart,
                    id: cart.id,
                    userId: cart.user_id,
                    cartItems: cart.cartItems.map(cartItem => ({
                        ...cartItem,
                        productId: cartItem.product_id,
                    })),
                    totalPrice: Number(cart.total_price),
                    createdAt: cart.created_at.toString(),
                    updatedAt: cart.updated_at.toString(),
                    deletedAt: cart.deleted_at ? cart.deleted_at.toString() : null,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async updateCart(data: IUpdateCartRequest): Promise<IUpdateCartResponse> {
        const { user, userId, id, cartItems } = data;
        // console.log(dataUpdate);
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            for (let i = 0; i < cartItems.length; i++) {
                const product = await this.productService.findOneById({
                    user: user,
                    id: cartItems[i].productId,
                });
                if (product.quantity < cartItems[i].quantity) {
                    throw new GrpcInvalidArgumentException('Product not enough');
                }
            }

            // Cập nhật thông tin của giỏ hàng
            const updatedCart = await this.prismaService.cart.update({
                where: { id },
                data: {
                    user_id: userId,
                    domain: user.domain,
                    // Xóa tất cả các mục giỏ hàng cũ và thêm lại các mục mới từ DTO
                    cartItems: {
                        deleteMany: {},
                        create: cartItems.map(cartItem => ({
                            product: { connect: { id: cartItem.productId } }, // Kết nối với sản phẩm đã tồn tại trong hệ thống
                            quantity: cartItem.quantity, // Số lượng của sản phẩm
                        })),
                    },
                },
                // Bao gồm thông tin về các mục giỏ hàng đã được tạo lại
                include: {
                    cartItems: true,
                },
            });

            return {
              cart: {
                ...updatedCart,
                id: updatedCart.id,
                userId: updatedCart.user_id,
                cartItems: updatedCart.cartItems.map(cartItem => ({
                    ...cartItem,
                    productId: cartItem.product_id,
                })),
                totalPrice: Number(updatedCart.total_price),
                createdAt: updatedCart.created_at.toString(),
                updatedAt: updatedCart.updated_at.toString(),
                deletedAt: updatedCart.deleted_at ? updatedCart.deleted_at.toString() : null,
            },
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCart(data: IDeleteCartRequest): Promise<IDeleteCartResponse> {
      const { user, id } = data;
      try {
          // find cart by id 
          const cart = await this.prismaService.cart.findUnique({
              where: {
                  id
              },
          });

          // check if cart not exists
          if (!cart) {
              throw new GrpcItemNotFoundException('Cart');
          }

          const deleteCart = await this.prismaService.cart.delete({
            where: {
                id: id,
            },
            include: {
              cartItems: {
                  select: {
                      product_id: true,
                      quantity: true,
                  },
              },
          },
        });

          return {
              cart: {
                  ...deleteCart,
                  id: deleteCart.id,
                  userId: deleteCart.user_id,
                  cartItems: deleteCart.cartItems.map(cartItem => ({
                      ...cartItem,
                      productId: cartItem.product_id,
                  })),
                  totalPrice: Number(deleteCart.total_price),
                  createdAt: deleteCart.created_at.toString(),
                  updatedAt: deleteCart.updated_at.toString(),
                  deletedAt: deleteCart.deleted_at ? deleteCart.deleted_at.toString() : null,
              },
          };
      } catch (error) {
          throw error;
      }
  }
}
