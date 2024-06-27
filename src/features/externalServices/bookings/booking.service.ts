import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import {
    BookingUsersService,
    IGetBookingsReportOfListUsersRequest,
    IGetBookingsReportOfListUsersResponse,
} from './booking.interface';

@Injectable()
export class BookingUserService {
    private bookingUsersService: BookingUsersService;

    constructor(@Inject('GRPC_TENANT_BOOKINGS') private readonly client: ClientGrpc) {}

    onModuleInit() {
        this.bookingUsersService = this.client.getService<BookingUsersService>('BookingService');
    }

    async getBookingsReportOfListUsers(
        data: IGetBookingsReportOfListUsersRequest,
    ): Promise<IGetBookingsReportOfListUsersResponse> {
        try {
            return await firstValueFrom(
                this.bookingUsersService.getBookingsReportOfListUsers(data),
            );
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
