import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { CartModule } from './cart/cart.module';

@Module({
    imports: [CategoryModule, ProductModule, VoucherModule, CartModule],
})
export class FeaturesModule {}
