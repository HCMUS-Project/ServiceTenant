import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
    ICreateOrderRequest,
    IGetOrderRequest,
    IGetOrderResponse,
    IListOrdersRequest,
    IListOrdersResponse,
} from './interface/order.interface';
import { ICreateCartResponse } from '../cart/interface/cart.interface';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @GrpcMethod('OrderService', 'CreateOrder')
    async create(data: ICreateOrderRequest): Promise<ICreateCartResponse> {
        return await this.orderService.create(data);
    }

    @GrpcMethod('OrderService', 'GetOrder')
    async get(data: IGetOrderRequest): Promise<IGetOrderResponse> {
        return await this.orderService.findOne(data);
    }

    // @GrpcMethod('OrderService', 'ListOrders')
    // async listOrders(data: IListOrdersRequest): Promise<IListOrdersResponse> {
    //     return await this.orderService.findAll();
    // }
}
