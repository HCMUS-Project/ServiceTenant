import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { VNPayConfigController } from './vnpayconfig.controller';
import { VNPayConfigService } from './vnpayconfig.service';

@Module({
    imports: [PrismaModule],
    controllers: [VNPayConfigController],
    providers: [VNPayConfigService],
    exports: [VNPayConfigService],
})
export class VNPayConfigModule {}
