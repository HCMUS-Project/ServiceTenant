import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseService } from '../supabase/supabase.service';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { VoucherService } from '../voucher/voucher.service';

@Module({
    imports: [PrismaModule],
    controllers: [ReviewController],
    providers: [ReviewService, ProductService, SupabaseService, OrderService, VoucherService],
})
export class ReviewModule {}
