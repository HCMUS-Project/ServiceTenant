import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/config.module';
import { ContextModule } from './configs/context/modules/contextStorage.module';
import { LoggerModule } from './core/logger/modules/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcExceptionFilter } from './core/response/exception.filter';
import { ResponseInterceptor } from './core/response/response.interceptor';
import { CacheModule } from './core/cache/modules/cache.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { TenantModule } from './features/tenant/tenant.module';
import { TenantProfileModule } from './features/tenantprofile/tenantprofile.module';

@Module({
    imports: [
        LoggerModule,
        ConfigsModule,
        ContextModule,
        CacheModule,
        PrismaModule,
        TenantModule,
        TenantProfileModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: GrpcExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule {}
