import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreateBannerRequest,
    ICreateBannerResponse,
    IFindBannerByTenantIdRequest,
    IFindBannerByIdResponse,
    IDeleteBannerRequest,
    IDeleteBannerResponse,
    IUpdateBannerRequest,
    IUpdateBannerResponse,
    IBannerResponse,
} from './interface/banner.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { Banner } from 'src/proto_build/tenant/banner_pb';
import { GrpcInvalidArgumentException, GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BannerService {
    constructor(private prismaService: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async create(dataRequest: ICreateBannerRequest): Promise<ICreateBannerResponse> {
        const { user, ...data } = dataRequest;
        
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            if (!data.image) {
                throw new GrpcInvalidArgumentException('INVALID_IMAGE');
            }
            // check if category name already exists
            if (
                await this.prismaService.banner.findFirst({
                    where: { tenant_id: data.tenantId },
                })
            ) {
                throw new GrpcAlreadyExistsException('BANNER_ALREADY_EXISTS');
            }

            const imageUrl = await this.supabaseService.uploadImageAndGetLink([data.image]);
            // create Banner
            const newBanner = await this.prismaService.banner.create({
                data: {
                    tenant_id: data.tenantId,
                    title: data.title,
                    description: data.description,
                    text_color: data.textColor,
                    image: imageUrl[0],
                },
            });

            return {
                banner: {
                    id: newBanner.id,
                    tenantId: newBanner.tenant_id,
                    title: newBanner.title,
                    description: newBanner.description,
                    textColor: newBanner.text_color,
                    image: newBanner.image,
                    createdAt: newBanner.createdAt.toISOString(),
                    updatedAt: newBanner.updatedAt.toISOString(),
                },
            } ;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Kiểm tra mã lỗi cụ thể từ Prisma
                if (error.code === 'P2002') {
                    throw new GrpcAlreadyExistsException('BANNER_ALREADY_EXISTS');
                } else if (error.code === 'P2003') {
                    throw new GrpcInvalidArgumentException('INVALID_TENANT_ID');
                } else {
                    console.error('Error code:', error.code, 'Error message:', error.message);
                    throw error;
                }
            } else {
                // Xử lý các lỗi không phải do Prisma
                console.error('Unexpected error:', error);
                throw error;
            }
        }
    }

    async findBannerByTenantId(data: IFindBannerByTenantIdRequest): Promise<IFindBannerByIdResponse> {
        const { tenantId } = data;
        try {
            // find Banner by id and domain
            const Banner = await this.prismaService.banner.findFirst({
                where: { tenant_id: tenantId },
            });

            // check if Banner not exists
            if (!Banner) {
                throw new GrpcItemNotFoundException('BANNER_NOT_FOUND');
            }

            return {
                banner: {
                    id: Banner.id,
                    tenantId: Banner.tenant_id,
                    title: Banner.title,
                    description: Banner.description,
                    textColor: Banner.text_color,
                    image: Banner.image,
                    createdAt: Banner.createdAt.toISOString(),
                    updatedAt: Banner.updatedAt.toISOString(),
                },
                // expireAt: newBanner.expire_at
            } as IBannerResponse;
        } catch (error) {
            throw error;
        }
    }

    async updateBanner(data: IUpdateBannerRequest): Promise<IUpdateBannerResponse> {
        const { user, ...dataUpdate } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Find the Banner first
            const Banner = await this.prismaService.banner.findUnique({
                where: { id: dataUpdate.id},
            });

            // If the Banner does not exist, throw an error
            if (!Banner) {
                throw new GrpcItemNotFoundException('BANNER_NOT_FOUND');
            }

            // If the Banner exists, perform the update
            const updatedBanner = await this.prismaService.banner.update({
                where: { id: dataUpdate.id},
                data: {
                    title: dataUpdate.title,
                    description: dataUpdate.description,
                    text_color: dataUpdate.textColor,
                },
            });

            return {
                banner: {
                    id: updatedBanner.id,
                    tenantId: updatedBanner.tenant_id,
                    title: updatedBanner.title,
                    description: updatedBanner.description,
                    textColor: updatedBanner.text_color,
                    image: updatedBanner.image,
                    createdAt: updatedBanner.createdAt.toISOString(),
                    updatedAt: updatedBanner.updatedAt.toISOString(),
                },
                // expireAt: newBanner.expire_at
            } as IBannerResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteBanner(data: IDeleteBannerRequest): Promise<IDeleteBannerResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the Banner first
            const Banner = await this.prismaService.banner.findUnique({
                where: { id: id },
            });

            // if the Banner does not exist, throw an error
            if (!Banner) {
                throw new GrpcItemNotFoundException('BANNER_NOT_FOUND');
            }

            // delete Banner by id and domain
            const deletedBanner = await this.prismaService.banner.delete({
                where: { id: id },
            });

            return {
                banner: {
                    id: deletedBanner.id,
                    tenantId: deletedBanner.tenant_id,
                    title: deletedBanner.title,
                    description: deletedBanner.description,
                    textColor: deletedBanner.text_color,
                    image: deletedBanner.image,
                    createdAt: deletedBanner.createdAt.toISOString(),
                    updatedAt: deletedBanner.updatedAt.toISOString(),
                },
                // expireAt: newBanner.expire_at
            } as IBannerResponse;
        } catch (error) {
            throw error;
        }
    }
}
