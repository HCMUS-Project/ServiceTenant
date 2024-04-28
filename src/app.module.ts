/**
 * Main module of the application
 * Sets the configuration module as a global module
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/config.module';
import { ContextModule } from './configs/context/modules/contextStorage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/responses/interceptors/response.interceptor';
import { MongoModule } from './core/database/modules/mongo.module';
import { CacheModule } from './core/cache/modules/cache.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Logger } from 'winston';
import { LoggerModule } from './core/logger/modules/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { Product } from './feature/ecommerce/product/entities/product.entity';
import { ProductModule } from './feature/ecommerce/product/product.module';
import { CategoryModule } from './feature/ecommerce/category/category.module';
import { CartModule } from './feature/ecommerce/cart/cart.module';

@Module({
    imports: [
        CacheModule,
        ConfigsModule,
        ContextModule,
        MongoModule,
        LoggerModule,
        PrismaModule,
        ProductModule,
        CategoryModule,
        CartModule,
        // CacheModule.registerAsync(RedisOptions)
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ],
})
export class AppModule {}
