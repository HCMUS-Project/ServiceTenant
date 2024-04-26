import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenProviders } from './token.providers';
import { MongoModule } from 'src/core/database/modules/mongo.module';
import { LoggerModule } from 'src/core/logger/modules/logger.module';
import { UsersModule } from '../../user/users/users.module';

@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_SECRET,
    }), MongoModule, LoggerModule, UsersModule],
    controllers: [TokenController],
    providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy, ...TokenProviders],
    exports: [TokenService],
})
export class TokenModule {}
