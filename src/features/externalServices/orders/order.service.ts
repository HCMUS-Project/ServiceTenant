import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import {
    IGetOrdersReportOfListUsersRequest,
    IGetOrdersReportOfListUsersResponse,
    OrderUsersService,
} from './order.interface';

@Injectable()
export class OrderUserService {
    private orderUsersService: OrderUsersService;

    constructor(@Inject('GRPC_TENANT_ORDERS') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.orderUsersService = this.client.getService<OrderUsersService>('OrderService');
    }

    async getOrdersReportOfListUsers(
        data: IGetOrdersReportOfListUsersRequest,
    ): Promise<IGetOrdersReportOfListUsersResponse> {
        try {
            return await firstValueFrom(this.orderUsersService.getOrdersReportOfListUsers(data));
        } catch (e) {
            // console.log(e)
            let errorDetails: { error?: string };
            try {
                errorDetails = JSON.parse(e.details);
            } catch (parseError) {
                console.error('Error parsing details:', parseError);
                throw new GrpcItemNotFoundException(String(e));
            }
            // console.log(errorDetails);

            if (errorDetails.error == 'PERMISSION_DENIED') {
                throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
            }
            if (errorDetails.error == 'DOMAIN_IS_EMPTY') {
                throw new GrpcItemNotFoundException('DOMAIN_IS_EMPTY');
            } else {
                throw new NotFoundException(
                    `Unhandled error type: ${errorDetails.error}`,
                    'Error not recognized',
                );
            }
        }
    }
}
