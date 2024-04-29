import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from '../product/product.service';
import { SupabaseService } from '../supabase/supabase.service';
import { VoucherService } from '../voucher/voucher.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, ProductService, SupabaseService, VoucherService],
})
export class OrderModule {}
