import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionService } from './subscription.service';
import {
    ICreateSubscriptionRequest,
    ICreateSubscriptionResponse,
    IUpdateSubscriptionStageByAdminRequest,
    IUpdateSubscriptionStageByAdminResponse,
    IFindAllSubscriptionByQueryRequest,
    IFindAllSubscriptionResponse,
    IFindPlansRequest,
    IFindPlansResponse,
    ICancelSubscriptionRequest,
    ICancelSubscriptionResponse,
    IFindAllSubscriptionByQueryAdminRequest,
} from './interface/subscription.interface';

@Controller()
export class SubscriptionController {
    constructor(private readonly SubscriptionService: SubscriptionService) {}

    @GrpcMethod('SubscriptionService', 'CreateSubscription')
    async create(data: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse> {
        return await this.SubscriptionService.create(data);
    }

    @GrpcMethod('SubscriptionService', 'FindAllSubscriptionByQuery')
    async findAllSubscriptionByQuery(
        data: IFindAllSubscriptionByQueryRequest,
    ): Promise<IFindAllSubscriptionResponse> {
        return await this.SubscriptionService.findAllSubscriptionByQuery(data);
    }

    @GrpcMethod('SubscriptionService', 'FindAllSubscriptionByQueryAdmin')
    async findAllSubscriptionByQueryAdmin(
        data: IFindAllSubscriptionByQueryAdminRequest,
    ): Promise<IFindAllSubscriptionResponse> {
        return await this.SubscriptionService.findAllSubscriptionByQueryAdmin(data);
    }

    @GrpcMethod('SubscriptionService', 'FindPlans')
    async findPlans(data: IFindPlansRequest): Promise<IFindPlansResponse> {
        return await this.SubscriptionService.findPlans(data);
    }

    @GrpcMethod('SubscriptionService', 'UpdateSubscriptionStageByAdmin')
    async updateSubscriptionStageByAdmin(
        data: IUpdateSubscriptionStageByAdminRequest,
    ): Promise<IUpdateSubscriptionStageByAdminResponse> {
        return await this.SubscriptionService.updateSubscriptionStageByAdmin(data);
    }

    @GrpcMethod('SubscriptionService', 'CancelSubscription')
    async cancelSubscription(
        data: ICancelSubscriptionRequest,
    ): Promise<ICancelSubscriptionResponse> {
        return await this.SubscriptionService.cancelSubscription(data);
    }
}
