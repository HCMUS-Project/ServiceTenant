import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from './core/logger/interfaces/logger.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Import the CACHE_MANAGER token from the @nestjs/cache package
 * Import the CacheStore interface from the @nestjs/cache package
 * */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private configService: ConfigService<ConfigModule>,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) {}

    async getHello(): Promise<object> {
        // Set a key/value pair in the cache and  set ttl to 100 seconds
        await this.cacheManager.set('key', '22222', {ttl: 100} );

        // Set a key/value pair in the cache and no ttl
        await this.cacheManager.set("key2", "value2");

        // Get a key/value pair from the cache
        const value = await this.cacheManager.get('key');

        this.logger.info('Cache', { props: { key: value } });
        
        const port = this.configService.get<number>('port');
        this.logger.info('Port', { props: { port } });
        this.logger.info(
            'I am a debug message!',
            {
                props: {
                    foo: 'bar',
                    baz: 'qux',
                },
            },
            'getHello',
        );

        // throw new BadRequestException('Ngu');
        return {
            res: 'success',
        };
    }
}
