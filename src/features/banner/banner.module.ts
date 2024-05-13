import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BannerController],
    providers: [BannerService],
    exports: [BannerService],
})
export class TenantModule {}
