import { Controller, Inject } from '@nestjs/common'; 
import { GrpcMethod } from '@nestjs/microservices';
import {CustomerService} from './customers.service';
import {IGetAllBookingsOrdersNumbersRequest, IGetAllBookingsOrdersNumbersResponse} from './interface/customers.interface';
 

@Controller()
export class CustomersController {
    constructor(
        private readonly customerService: CustomerService) {}

    @GrpcMethod('CustomersService', 'GetAllBookingsOrdersNumbers')
    async getAllBookingOrdersNumbers(data: IGetAllBookingsOrdersNumbersRequest): Promise<IGetAllBookingsOrdersNumbersResponse> {
        return await this.customerService.getAllBookingsOrdersNumbers(data);
    }
 
    
}