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

    async create(createOrderDto: ICreateOrderRequest) {
        // try {
        //     for (let i = 0; i < createOrderDto.productsId.length; i++) {
        //         const product = await this.ProductService.findOneById({
        //             id: createOrderDto.productsId[i],
        //             domain: createOrderDto.domain,
        //         });
        //         if (product.quantity < createOrderDto.quantities[i]) {
        //             throw new Error(`Quantity of product ${product.name} is not enough`);
        //         }
        //     }
        //     const voucher_applied = await this.VoucherService.findOne(
        //         createOrderDto.voucher_id,
        //         createOrderDto.domain,
        //     );
        //     if (voucher_applied !== null) {
        //         if (voucher_applied.expire_at < new Date()) {
        //             throw new Error('Voucher is expired');
        //         }
        //     } else {
        //         throw new Error('Voucher is not valid');
        //     }
        //     const total_price = await this.calculateTotalPrice(
        //         createOrderDto.products_id,
        //         createOrderDto.quantities,
        //     );
        //     let price_after_voucher = total_price;
        //     let discount_value = 0;
        //     if (createOrderDto.voucher_id !== undefined) {
        //         if (total_price < Number(voucher_applied.min_app_value)) {
        //             throw new Error('Total price is not enough to apply this voucher');
        //         } else {
        //             discount_value = (total_price * Number(voucher_applied.discount_percent)) / 100;
        //             if (discount_value > total_price) {
        //                 price_after_voucher = 0;
        //             }
        //             if (discount_value > Number(voucher_applied.max_discount)) {
        //                 discount_value = Number(voucher_applied.max_discount);
        //                 price_after_voucher = total_price - Number(voucher_applied.max_discount);
        //             } else {
        //                 price_after_voucher = total_price - discount_value;
        //             }
        //         }
        //     }
        //     const order = await this.prismaService.order.create({
        //         data: {
        //             domain: createOrderDto.domain,
        //             user_id: createOrderDto.user_id,
        //             stage: 'pending',
        //             orderItems: {
        //                 create: createOrderDto.products_id.map((productId, index) => ({
        //                     product: { connect: { id: productId } },
        //                     quantity: createOrderDto.quantities[index],
        //                 })),
        //             },
        //             total_price: total_price,
        //             phone: createOrderDto.phone,
        //             address: createOrderDto.address,
        //             voucher_id: createOrderDto.voucher_id,
        //             voucher_discount: discount_value,
        //             price_after_voucher: price_after_voucher,
        //         },
        //         include: {
        //             orderItems: true,
        //         },
        //     });
        //     for (let i = 0; i < order.orderItems.length; i++) {
        //         await this.ProductService.updateProductSold(
        //             order.orderItems[i].product_id,
        //             order.orderItems[i].quantity,
        //         );
        //     }
        //     return order;
        // } catch (error) {
        //     throw new Error(error.message);
        // }
    }
}
