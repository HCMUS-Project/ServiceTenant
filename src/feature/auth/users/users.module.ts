import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/modules/database.module';
import { LoggerModule } from 'src/core/logger/modules/logger.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProviders } from './users.providers';

@Module({
    imports: [DatabaseModule, LoggerModule],
    controllers: [UsersController],
    providers: [UsersService, ...UserProviders],
    exports: [UsersService],
})
export class UsersModule {}
