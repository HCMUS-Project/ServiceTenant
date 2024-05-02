import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ProductService } from '../product/product.service';
import { VoucherService } from '../voucher/voucher.service';
import { ICreateOrderRequest } from './interface/order.interface';

@Injectable()
export class OrderService {
    constructor(
        private prismaService: PrismaService,
        private ProductService: ProductService,
        private VoucherService: VoucherService,
    ) {}

    async create(createOrderDto: ICreateOrderRequest): Promise<any> {
        try {
            // Check product quantity
            for (let i = 0; i < createOrderDto.productsId.length; i++) {
                const product = await this.ProductService.findOneById({
                    id: createOrderDto.productsId[i],
                    user: createOrderDto.user,
                });
                if (product.quantity < createOrderDto.quantities[i]) {
                    throw new Error(`Quantity of product ${product.name} is not enough`);
                }
            }

            // Check voucher
            let voucher_applied = null;
            if (createOrderDto.voucherId) {
                voucher_applied = await this.VoucherService.findById({
                    id: createOrderDto.voucherId,
                    user: createOrderDto.user,
                });
                if (voucher_applied !== null) {
                    if (new Date(voucher_applied.voucher.expireAt) < new Date()) {
                        throw new Error('Voucher is expired');
                    }
                } else {
                    throw new Error('Voucher is not valid');
                }
            }

            // Calculate total price
            const total_price = await this.calculateTotalPrice(
                createOrderDto.productsId,
                createOrderDto.quantities,
            );

            let price_after_voucher = total_price;
            let discount_value = 0;
            if (createOrderDto.voucherId) {
                if (total_price < Number(voucher_applied.min_app_value)) {
                    throw new Error('Total price is not enough to apply this voucher');
                } else {
                    discount_value = (total_price * Number(voucher_applied.discount_percent)) / 100;
                    if (discount_value > total_price) {
                        price_after_voucher = 0;
                    }
                    if (discount_value > Number(voucher_applied.max_discount)) {
                        discount_value = Number(voucher_applied.max_discount);
                        price_after_voucher = total_price - Number(voucher_applied.max_discount);
                    } else {
                        price_after_voucher = total_price - discount_value;
                    }
                }
            }

            // Create order
            const order = await this.prismaService.order.create({
                data: {
                    domain: createOrderDto.user.domain,
                    user: createOrderDto.user.email,
                    stage: 'pending',
                    orderItems: {
                        create: createOrderDto.productsId.map((productId, index) => ({
                            product: { connect: { id: productId } },
                            quantity: createOrderDto.quantities[index],
                        })),
                    },
                    total_price: total_price,
                    phone: createOrderDto.phone,
                    address: createOrderDto.address,
                    voucher_id: createOrderDto.voucherId ? createOrderDto.voucherId : null,
                    voucher_discount: discount_value,
                    price_after_voucher: price_after_voucher,
                },
                include: {
                    orderItems: true,
                },
            });

            // Update product quantity
            for (let i = 0; i < order.orderItems.length; i++) {
                await this.prismaService.product.update({
                    where: {
                        id: order.orderItems[i].product_id,
                    },
                    data: {
                        quantity: order.orderItems[i].quantity,
                    },
                });
            }

            // Update cart

            return order;
        } catch (error) {
            throw error;
        }
    }

    async calculateTotalPrice(productIds: string[], quantities: number[]): Promise<number> {
        try {
            // Create a variable to store the total price
            let totalPrice: number = 0;

            // Loop through all products
            for (let i = 0; i < productIds.length; i++) {
                // Get the price of the product
                const price = await this.ProductService.getPriceOfProduct(productIds[i]);

                // Calculate the total price
                totalPrice = Number(totalPrice) + Number(price) * quantities[i];
            }

            return totalPrice;
        } catch (error) {
            throw new Error('Failed to calculate total price. Please try again.');
        }
    }
}
