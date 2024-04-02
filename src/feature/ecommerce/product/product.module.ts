import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, SupabaseService],
})
export class ProductModule {}
