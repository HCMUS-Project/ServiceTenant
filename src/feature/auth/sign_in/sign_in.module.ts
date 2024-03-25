import { Module } from '@nestjs/common';
import { SignInService } from './sign_in.service';
import { SignInController } from './sign_in.controller';
import { DatabaseModule } from 'src/core/database/modules/database.module';
import { UserSchema } from '../../../models/user/schemas/user.schema';
// @ts-ignore
import { MongooseModule } from '@nestjs/mongoose';
import { signInProviders } from './sign_in.provider';
import { LoggerModule } from 'src/core/logger/modules/logger.module';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [DatabaseModule, LoggerModule, TokenModule, UsersModule],
    controllers: [SignInController],
    providers: [SignInService, ...signInProviders],
})
export class SignInModule {}