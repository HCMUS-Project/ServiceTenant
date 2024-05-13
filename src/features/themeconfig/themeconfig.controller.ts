import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { ThemeConfigService } from './themeconfig.service';
import {
    ICreateThemeConfigRequest,
    ICreateThemeConfigResponse,
    IFindThemeConfigByTenantIdRequest,
    IFindThemeConfigByIdResponse,
    IDeleteThemeConfigRequest,
    IDeleteThemeConfigResponse,
    IUpdateThemeConfigRequest,
    IUpdateThemeConfigResponse,
} from './interface/themeconfig.interface';

@Controller()
export class ThemeConfigController {
    constructor(private readonly ThemeConfigService: ThemeConfigService) {}

    @GrpcMethod('ThemeConfigService', 'CreateThemeConfig')
    async create(data: ICreateThemeConfigRequest): Promise<ICreateThemeConfigResponse> {
        return await this.ThemeConfigService.create(data);
    }

    @GrpcMethod('ThemeConfigService', 'FindThemeConfigByTenantId')
    async findByTenantId(data: IFindThemeConfigByTenantIdRequest): Promise<IFindThemeConfigByIdResponse> {
        return await this.ThemeConfigService.findThemeConfigByTenantId(data);
    }

    @GrpcMethod('ThemeConfigService', 'UpdateThemeConfig')
    async updateThemeConfig(data: IUpdateThemeConfigRequest): Promise<IUpdateThemeConfigResponse> {
        return await this.ThemeConfigService.updateThemeConfig(data);
    }

    @GrpcMethod('ThemeConfigService', 'DeleteThemeConfig')
    async deleteThemeConfig(data: IDeleteThemeConfigRequest): Promise<IDeleteThemeConfigResponse> {
        return await this.ThemeConfigService.deleteThemeConfig(data);
    }
}
