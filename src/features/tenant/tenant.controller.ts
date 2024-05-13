import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { TenantService } from './tenant.service';
import {
    ICreateTenantRequest,
    ICreateTenantResponse,
    IFindTenantByIdRequest,
    IFindTenantByIdResponse,
    IDeleteTenantRequest,
    IDeleteTenantResponse,
    IUpdateTenantRequest,
    IUpdateTenantResponse,
    IFindTenantByDomainRequest,
    IFindTenantByDomainResponse,  
} from './interface/tenant.interface';

@Controller()
export class TenantController {
    constructor(private readonly tenantService: TenantService) {}

    @GrpcMethod('TenantService', 'CreateTenant')
    async create(data: ICreateTenantRequest): Promise<ICreateTenantResponse> {
        return await this.tenantService.create(data);
    }

    @GrpcMethod('TenantService', 'FindTenantById')
    async findById(data: IFindTenantByIdRequest): Promise<IFindTenantByIdResponse> {
        return await this.tenantService.findTenantById(data);
    }

    @GrpcMethod('TenantService', 'FindTenantByDomain')
    async findByDomain(data: IFindTenantByDomainRequest): Promise<IFindTenantByDomainResponse> {
        return await this.tenantService.findTenantByDomain(data);
    }

    @GrpcMethod('TenantService', 'UpdateTenant')
    async updateTenant(data: IUpdateTenantRequest): Promise<IUpdateTenantResponse> {
        return await this.tenantService.updateTenant(data);
    }

    @GrpcMethod('TenantService', 'DeleteTenant')
    async deleteTenant(data: IDeleteTenantRequest): Promise<IDeleteTenantResponse> {
        return await this.tenantService.deleteTenant(data);
    }
}
