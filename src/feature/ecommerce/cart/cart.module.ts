import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from '../product/product.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
    imports: [PrismaModule],
    controllers: [CartController],
    providers: [CartService, ProductService, SupabaseService],
})
export class CartModule {}
