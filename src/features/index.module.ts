import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { CartModule } from './cart/cart.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';

@Module({
    imports: [CategoryModule, ProductModule, VoucherModule, CartModule, ReviewModule, OrderModule],
})
export class FeaturesModule {}
