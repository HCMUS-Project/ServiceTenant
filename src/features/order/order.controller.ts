import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ICreateOrderRequest } from './interface/order.interface';
import { ICreateCartResponse } from '../cart/interface/cart.interface';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @GrpcMethod('OrderService', 'CreateOrder')
    async create(data: ICreateOrderRequest): Promise<ICreateCartResponse> {
        return await this.orderService.create(data);
    }
}
