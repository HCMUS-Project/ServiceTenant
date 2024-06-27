import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ProfileUserService } from '../externalServices/profileUsers/profile.service';
import {
    IGetAllBookingsOrdersNumbersRequest,
    IGetAllBookingsOrdersNumbersResponse,
} from './interface/customers.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { IGetAllUserProfileRequest } from '../externalServices/profileUsers/profile.interface';
import { OrderUserService } from '../externalServices/orders/order.service';
import {BookingUserService} from '../externalServices/bookings/booking.service';

@Injectable()
export class CustomerService {
    constructor(
        private prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly profileUserService: ProfileUserService,
        private readonly orderUserService: OrderUserService,
        private readonly bookingUserService: BookingUserService,
    ) {}

    async getAllBookingsOrdersNumbers(
        data: IGetAllBookingsOrdersNumbersRequest,
    ): Promise<IGetAllBookingsOrdersNumbersResponse> {
        const { user } = data;
        // check role of tenant
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Call auth service to find users
            const dataUser: IGetAllUserProfileRequest = {
                user: user,
            };
            const users = await this.profileUserService.getAllUserProfile(dataUser);
            const listUsers = users.users;

            const listEmail = listUsers.map(user => user.email);

            const listOrders = await this.orderUserService.getOrdersReportOfListUsers({
                user: user,
                emails: listEmail,
            });
            const listBookings = await this.bookingUserService.getBookingsReportOfListUsers({
                user: user,
                emails: listEmail
            })
            const mixedData = {
                customers: listUsers.map(user => {
                    const reportOrder = listOrders.reportOrders.find(
                        report => report.email === user.email,
                    );
                    const reportBooking = listBookings.reportBooking.find(
                        report => report.email === user.email,
                    )
                    return {
                        name: user.name,
                        address: user.address,
                        phone: user.phone,
                        email: user.email,
                        totalOrders: reportOrder ? reportOrder.totalOrder : 0,
                        totalBookings: reportBooking ? reportBooking.totalBooking : 0,
                    };
                }),
            };
            return mixedData
        } catch (error) {
            throw error;
        }
    }
}
