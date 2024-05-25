import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices'; 
import {VNPayConfigService} from './vnpayconfig.service';
import {ICreateVNPayConfigRequest, ICreateVNPayConfigResponse, IDeleteVNPayConfigRequest, IDeleteVNPayConfigResponse, IGetVNPayConfigByTenantIdRequest, IGetVNPayConfigByTenantIdResponse, IUpdateVNPayConfigRequest, IUpdateVNPayConfigResponse, IVNPayConfigResponse} from './interface/vnpayconfig.interface';
 

@Controller()
export class VNPayConfigController {
    constructor(private readonly VNPayConfigService: VNPayConfigService) {}

    @GrpcMethod('VNPayConfigService', 'CreateVNPayConfig')
    async create(data: ICreateVNPayConfigRequest): Promise<ICreateVNPayConfigResponse> {
        return await this.VNPayConfigService.createVNPayConfig(data);
    }

    @GrpcMethod('VNPayConfigService', 'GetVNPayConfigByTenantId')
    async findByTenantId(data: IGetVNPayConfigByTenantIdRequest): Promise<IGetVNPayConfigByTenantIdResponse> {
        return await this.VNPayConfigService.getVNPayConfigByTenantId(data);
    }

    @GrpcMethod('VNPayConfigService', 'UpdateVNPayConfig')
    async update(data: IUpdateVNPayConfigRequest): Promise<IUpdateVNPayConfigResponse> {
        return await this.VNPayConfigService.updateVNPayConfig(data);
    }

    @GrpcMethod('VNPayConfigService', 'DeleteVNPayConfig')
    async delete(data: IDeleteVNPayConfigRequest): Promise<IDeleteVNPayConfigResponse> {
        return await this.VNPayConfigService.deleteVNPayConfig(data);
    }
}
