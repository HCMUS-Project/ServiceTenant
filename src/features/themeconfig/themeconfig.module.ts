import { Module } from '@nestjs/common';
import { ThemeConfigService } from './themeconfig.service';
import { ThemeConfigController } from './themeconfig.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SupabaseService } from 'src/util/supabase/supabase.service';

@Module({
    imports: [PrismaModule],
    controllers: [ThemeConfigController],
    providers: [ThemeConfigService, SupabaseService],
    exports: [ThemeConfigService],
})
export class ThemeConfigModule {}
