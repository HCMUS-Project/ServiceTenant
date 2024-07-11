import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ProfileUserService } from '../externalServices/profileUsers/profile.service';
import {
    IGetAllBookingsOrdersNumbersRequest,
    IGetAllBookingsOrdersNumbersResponse,
    IGetUsersReportByDateRequest,
    IGetUsersReportByDateResponse,
} from './interface/customers.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import {
    IGetAllUserProfileRequest,
    IGetProfileResponse,
} from '../externalServices/profileUsers/profile.interface';
import { OrderUserService } from '../externalServices/orders/order.service';
import { BookingUserService } from '../externalServices/bookings/booking.service';
import { DateType } from 'src/proto_build/tenant/customers_pb';

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
                emails: listEmail,
            });
            const mixedData = {
                customers: listUsers.map(user => {
                    const reportOrder = listOrders.reportOrders.find(
                        report => report.email === user.email,
                    );
                    const reportBooking = listBookings.reportBooking.find(
                        report => report.email === user.email,
                    );
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
            return mixedData;
        } catch (error) {
            throw error;
        }
    }

    async getUsersReportByDate(
        data: IGetUsersReportByDateRequest,
    ): Promise<IGetUsersReportByDateResponse> {
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
            const responseUserService = await this.profileUserService.getAllUserProfile(dataUser);
            const listUsers = responseUserService.users;

            let totalUsers = 0;
            // const reportUsers = [];

            function processUsers(
                listUsers: IGetProfileResponse[],
                dateGetter: (day: Date) => string,
            ) {
                const listUsersByDate: {
                    [key: string]: { totalUsers: number };
                } = {};
                console.log(listUsers);
                listUsers.forEach(user => {
                    const date = dateGetter(new Date(user.createdAt));
                    if (listUsersByDate[date]) {
                        listUsersByDate[date].totalUsers += 1;
                    } else {
                        listUsersByDate[date] = {
                            totalUsers: 1,
                        };
                    }
                    totalUsers += 1;
                    // console.log(listUsersByDate[date])
                });

                return Object.entries(listUsersByDate).map(([date, report]) => ({
                    type: date,
                    totalUsers: report.totalUsers,
                }));
            }
            let reportUsers = [];
            if (data.type.toString() === getEnumKeyByEnumValue(DateType, DateType.WEEK)) {
                const listUsersInWeek = listUsers.filter(user => {
                    const createdAt = new Date(user.createdAt);
                    const today = new Date();
                    return (
                        // createdAt.() === today.get()
                        this.isSameWeek(createdAt, today)
                    );
                });
                reportUsers = [...processUsers(listUsersInWeek, this.getDayOfWeek)];
            } else if (data.type.toString() === getEnumKeyByEnumValue(DateType, DateType.YEAR)) {
                const listUsersInYear = listUsers.filter(user => {
                    const createdAt = new Date(user.createdAt);
                    const today = new Date();
                    return ( 
                        createdAt.getUTCFullYear() === today.getUTCFullYear() 
                    );
                });
                reportUsers = [...processUsers(listUsersInYear, this.getMonth)];
            } else if (data.type.toString() === getEnumKeyByEnumValue(DateType, DateType.MONTH)) { 
                const listUsersInMonth = listUsers.filter(user => {
                    const createdAt = new Date(user.createdAt);
                    const today = new Date();
                    return (
                        createdAt.getUTCMonth() === today.getUTCMonth() &&
                        createdAt.getUTCFullYear() === today.getUTCFullYear()
                    );
                });
                reportUsers = [...processUsers(listUsersInMonth, this.getWeekOfMonth)];
            } 

            return {
                report: reportUsers,
                total: totalUsers,
            };
        } catch (error) {
            throw error;
        }
    }

    isSameWeek(date1: Date, date2: Date): boolean {
        // Get the start of the week (Monday) for the first date
        const startOfWeek1 = new Date(date1);
        startOfWeek1.setDate(date1.getDate() - date1.getDay() + (date1.getDay() === 0 ? -6 : 1));
    
        // Get the start of the week (Monday) for the second date
        const startOfWeek2 = new Date(date2);
        startOfWeek2.setDate(date2.getDate() - date2.getDay() + (date2.getDay() === 0 ? -6 : 1));
    
        // Compare the start of the week dates
        return startOfWeek1.getFullYear() === startOfWeek2.getFullYear() &&
               startOfWeek1.getMonth() === startOfWeek2.getMonth() &&
               startOfWeek1.getDate() === startOfWeek2.getDate();
    }

    getWeekOfMonth(date: Date): string {
        // Get the first day of the month
        const firstDayOfMonth = new Date(date.getFullYear(), date.getUTCMonth(), 1);
        // Get the day of the week for the first day of the month (0 is Sunday, 6 is Saturday)
        let firstDayOfWeek = firstDayOfMonth.getDay();

        // Adjust to make Monday the first day of the week
        // If the first day is Sunday (0), set it to 7 for easier calculations
        if (firstDayOfWeek === 0) {
            firstDayOfWeek = 7;
        }

        // Calculate the adjusted date for Monday start week
        // console.log(date.getUTCDate() + firstDayOfWeek);
        const adjustedDate = date.getUTCDate() + firstDayOfWeek - 2;
        const weekNumber = Math.floor(adjustedDate / 7) + 1;

        return `WEEK_${weekNumber}`;
    }

    getDayOfWeek(date: Date): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getUTCDay()];
    }

    getMonth(date: Date): string {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        return months[date.getUTCMonth()];
    }
}
