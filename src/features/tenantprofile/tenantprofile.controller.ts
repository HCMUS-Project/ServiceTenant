import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { TenantProfileService } from './tenantprofile.service';
import {
    ICreateTenantProfileRequest,
    ICreateTenantProfileResponse,
    IFindTenantProfileByTenantIdRequest,
    IFindTenantProfileByIdResponse,
    IDeleteTenantProfileRequest,
    IDeleteTenantProfileResponse,
    IUpdateTenantProfileRequest,
    IUpdateTenantProfileResponse,
} from './interface/tenantprofile.interface';

@Controller()
export class TenantProfileController {
    constructor(private readonly TenantProfileService: TenantProfileService) {
    }

    @GrpcMethod('TenantProfileService', 'CreateTenantProfile')
    async create(data: ICreateTenantProfileRequest): Promise<ICreateTenantProfileResponse> {
        return await this.TenantProfileService.create(data);
    }

    @GrpcMethod('TenantProfileService', 'FindTenantProfileByTenantId')
    async findByTenantId(data: IFindTenantProfileByTenantIdRequest): Promise<IFindTenantProfileByIdResponse> {
        return await this.TenantProfileService.findTenantProfileByTenantId(data);
    }

    @GrpcMethod('TenantProfileService', 'UpdateTenantProfile')
    async updateTenantProfile(data: IUpdateTenantProfileRequest): Promise<IUpdateTenantProfileResponse> {
        return await this.TenantProfileService.updateTenantProfile(data);
    }

    @GrpcMethod('TenantProfileService', 'DeleteTenantProfile')
    async deleteTenantProfile(data: IDeleteTenantProfileRequest): Promise<IDeleteTenantProfileResponse> {
        return await this.TenantProfileService.deleteTenantProfile(data);
    }
}
