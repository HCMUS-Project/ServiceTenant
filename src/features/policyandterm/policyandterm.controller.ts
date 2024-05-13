import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { PolicyAndTermService } from './policyandterm.service';
import {
    ICreatePolicyAndTermRequest,
    ICreatePolicyAndTermResponse,
    IFindPolicyAndTermByTenantIdRequest,
    IFindPolicyAndTermByIdResponse,
    IDeletePolicyAndTermRequest,
    IDeletePolicyAndTermResponse,
    IUpdatePolicyAndTermRequest,
    IUpdatePolicyAndTermResponse,
} from './interface/policyandterm.interface';

@Controller()
export class PolicyAndTermController {
    constructor(private readonly PolicyAndTermService: PolicyAndTermService) {}

    @GrpcMethod('PolicyAndTermService', 'CreatePolicyAndTerm')
    async create(data: ICreatePolicyAndTermRequest): Promise<ICreatePolicyAndTermResponse> {
        return await this.PolicyAndTermService.create(data);
    }

    @GrpcMethod('PolicyAndTermService', 'FindPolicyAndTermByTenantId')
    async findByTenantId(data: IFindPolicyAndTermByTenantIdRequest): Promise<IFindPolicyAndTermByIdResponse> {
        return await this.PolicyAndTermService.findPolicyAndTermByTenantId(data);
    }

    @GrpcMethod('PolicyAndTermService', 'UpdatePolicyAndTerm')
    async updatePolicyAndTerm(data: IUpdatePolicyAndTermRequest): Promise<IUpdatePolicyAndTermResponse> {
        return await this.PolicyAndTermService.updatePolicyAndTerm(data);
    }

    @GrpcMethod('PolicyAndTermService', 'DeletePolicyAndTerm')
    async deletePolicyAndTerm(data: IDeletePolicyAndTermRequest): Promise<IDeletePolicyAndTermResponse> {
        return await this.PolicyAndTermService.deletePolicyAndTerm(data);
    }
}
