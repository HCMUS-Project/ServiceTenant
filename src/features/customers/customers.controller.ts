import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CustomerService } from './customers.service';
import {
    IGetAllBookingsOrdersNumbersRequest,
    IGetAllBookingsOrdersNumbersResponse,
    IGetUsersReportByDateRequest,
    IGetUsersReportByDateResponse,
} from './interface/customers.interface';

@Controller()
export class CustomersController {
    constructor(private readonly customerService: CustomerService) {}

    @GrpcMethod('CustomersService', 'GetAllBookingsOrdersNumbers')
    async getAllBookingOrdersNumbers(
        data: IGetAllBookingsOrdersNumbersRequest,
    ): Promise<IGetAllBookingsOrdersNumbersResponse> {
        return await this.customerService.getAllBookingsOrdersNumbers(data);
    }

    @GrpcMethod('CustomersService', 'GetUsersReportByDate')
    async getUsersReportByDate(
        data: IGetUsersReportByDateRequest,
    ): Promise<IGetUsersReportByDateResponse> {
        return await this.customerService.getUsersReportByDate(data);
    }
}
