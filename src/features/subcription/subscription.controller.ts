import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionService } from './subscription.service';
import {
    ICreateSubscriptionRequest,
    ICreateSubscriptionResponse,
    IFindSubscriptionByTenantIdRequest,
    IFindSubscriptionByIdResponse,
    IDeleteSubscriptionRequest,
    IDeleteSubscriptionResponse,
    IUpdateSubscriptionRequest,
    IUpdateSubscriptionResponse,
} from './interface/subscription.interface';

@Controller()
export class SubscriptionController {
    constructor(private readonly SubscriptionService: SubscriptionService) {}

    @GrpcMethod('SubscriptionService', 'CreateSubscription')
    async create(data: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse> {
        return await this.SubscriptionService.create(data);
    }

    @GrpcMethod('SubscriptionService', 'FindSubscriptionByTenantId')
    async findByTenantId(data: IFindSubscriptionByTenantIdRequest): Promise<IFindSubscriptionByIdResponse> {
        return await this.SubscriptionService.findSubscriptionByTenantId(data);
    }

    @GrpcMethod('SubscriptionService', 'UpdateSubscription')
    async updateSubscription(data: IUpdateSubscriptionRequest): Promise<IUpdateSubscriptionResponse> {
        return await this.SubscriptionService.updateSubscription(data);
    }

    @GrpcMethod('SubscriptionService', 'DeleteSubscription')
    async deleteSubscription(data: IDeleteSubscriptionRequest): Promise<IDeleteSubscriptionResponse> {
        return await this.SubscriptionService.deleteSubscription(data);
    }
}
