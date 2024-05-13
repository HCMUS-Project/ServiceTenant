import { Module } from '@nestjs/common';
import { TenantProfileService } from './tenantprofile.service';
import { TenantProfileController } from './tenantprofile.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SupabaseService } from 'src/util/supabase/supabase.service';

@Module({
    imports: [PrismaModule],
    controllers: [TenantProfileController],
    providers: [TenantProfileService, SupabaseService],
    exports: [TenantProfileService],
})
export class TenantProfileModule {}
