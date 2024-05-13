import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SupabaseService } from 'src/util/supabase/supabase.service';

@Module({
    imports: [PrismaModule],
    controllers: [BannerController],
    providers: [BannerService, SupabaseService],
    exports: [BannerService],
})
export class BannerModule {}
