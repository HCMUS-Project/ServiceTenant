import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SupabaseService } from 'src/util/supabase/supabase.service';

@Module({
    imports: [PrismaModule],
    controllers: [SubscriptionController],
    providers: [SubscriptionService, SupabaseService],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
