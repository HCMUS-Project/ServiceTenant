import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { CustomersController } from './customers.controller';
import { CustomerService } from './customers.service';
import { ProfileUserService } from '../externalServices/profileUsers/profile.service';
import { ExternalServiceModule } from '../externalServices/external.module';
import { OrderUserService } from '../externalServices/orders/order.service';
import { BookingUserService } from '../externalServices/bookings/booking.service';

@Module({
    imports: [PrismaModule, ExternalServiceModule],
    controllers: [CustomersController],
    providers: [
        CustomerService,
        PrismaService,
        ProfileUserService,
        OrderUserService,
        BookingUserService,
    ],
})
export class CustomersModule {}
