import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { OrderUserService } from './orders/order.service';
import { ProfileUserService } from './profileUsers/profile.service';
@Module({
    imports: [ClientsModule],
    providers: [
        {
            provide: 'GRPC_TENANT_AUTH',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: ['profile'],
                        protoPath: join(__dirname, '../../../src/proto/main.proto'),
                        url: configService.get<string>('AUTH_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                            includeDirs: [join(__dirname, '../../../src/proto/')],
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
        {
            provide: 'GRPC_TENANT_ORDERS',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: ['order'],
                        protoPath: join(__dirname, '../../../src/proto/main.proto'),
                        url: configService.get<string>('ECOMMERCE_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                            includeDirs: [join(__dirname, '../../../src/proto/')],
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
        {
            provide: 'GRPC_TENANT_BOOKINGS',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: ['booking'],
                        protoPath: join(__dirname, '../../../src/proto/main.proto'),
                        url: configService.get<string>('BOOKING_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                            includeDirs: [join(__dirname, '../../../src/proto/')],
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
        {
            provide: 'GRPC_TENANT_PAYMENTS',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.GRPC,
                    options: {
                        package: ['payment'],
                        protoPath: join(__dirname, '../../../src/proto/main.proto'),
                        url: configService.get<string>('PAYMENT_SERVICE_URL'),
                        loader: {
                            enums: String,
                            objects: true,
                            arrays: true,
                            includeDirs: [join(__dirname, '../../../src/proto/')],
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: ['GRPC_TENANT_AUTH', 'GRPC_TENANT_ORDERS', 'GRPC_TENANT_BOOKINGS', 'GRPC_TENANT_PAYMENTS'],
})
export class ExternalServiceModule {}
