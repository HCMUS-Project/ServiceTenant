import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { ExternalServiceModule } from '../externalServices/external.module';
import { PaymentTenantService } from '../externalServices/payment_service/payment.service';

@Module({
    imports: [PrismaModule, ExternalServiceModule],
    controllers: [SubscriptionController],
    providers: [SubscriptionService, SupabaseService, PaymentTenantService],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
