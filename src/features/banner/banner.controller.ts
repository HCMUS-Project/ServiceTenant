import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { BannerService } from './banner.service';
import {
    ICreateBannerRequest,
    ICreateBannerResponse,
    IFindBannerByIdRequest,
    IFindBannerByIdResponse,
    IDeleteBannerRequest,
    IDeleteBannerResponse,
    IUpdateBannerRequest,
    IUpdateBannerResponse,
} from './interface/banner.interface';

@Controller()
export class BannerController {
    constructor(private readonly BannerService: BannerService) {}

    @GrpcMethod('BannerService', 'CreateBanner')
    async create(data: ICreateBannerRequest): Promise<ICreateBannerResponse> {
        return await this.BannerService.create(data);
    }

    @GrpcMethod('BannerService', 'FindBannerById')
    async findById(data: IFindBannerByIdRequest): Promise<IFindBannerByIdResponse> {
        return await this.BannerService.findBannerById(data);
    }

    @GrpcMethod('BannerService', 'UpdateBanner')
    async updateBanner(data: IUpdateBannerRequest): Promise<IUpdateBannerResponse> {
        return await this.BannerService.updateBanner(data);
    }

    @GrpcMethod('BannerService', 'DeleteBanner')
    async deleteBanner(data: IDeleteBannerRequest): Promise<IDeleteBannerResponse> {
        return await this.BannerService.deleteBanner(data);
    }
}
