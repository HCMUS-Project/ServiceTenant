import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreateTenantProfileRequest,
    ICreateTenantProfileResponse,
    IFindTenantProfileByTenantIdRequest,
    IFindTenantProfileByIdResponse,
    IDeleteTenantProfileRequest,
    IDeleteTenantProfileResponse,
    IUpdateTenantProfileRequest,
    IUpdateTenantProfileResponse,
    ITenantProfileResponse,  
} from './interface/tenantprofile.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcInternalException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { TenantProfile } from 'src/proto_build/tenant/tenantprofile_pb';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { GrpcInvalidArgumentException, GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenantProfileService {
    constructor(private prismaService: PrismaService,
        private supabaseService: SupabaseService
    ) {}

    async create(dataRequest: ICreateTenantProfileRequest): Promise<ICreateTenantProfileResponse> {
        const { user, ...data } = dataRequest;
        // console.log(dataRequest);
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // check if category name already exists
            if (
                await this.prismaService.tenantProfile.findFirst({
                    where: { tenant_id: data.tenantId},
                })
            ) {
                throw new GrpcAlreadyExistsException('TENANT_PROFILE_ALREADY_EXISTS');
            }
            const logo = await this.supabaseService.uploadImageAndGetLink([data.logo]);

            // create TenantProfile
            const newTenantProfile = await this.prismaService.tenantProfile.create({
                data: {
                    tenant_id: data.tenantId,
                    email: user.email,
                    service_name: data.serviceName,
                    address: data.address,
                    phone_number: data.phoneNumber,
                    logo: logo[0],
                    description: data.description,
                    facebook_url: data.facebookUrl,
                    instagram_url: data.instagramUrl,
                    youtube_url: data.youtubeUrl,
                },
            });

            return {
                tenantProfile: {
                    id: newTenantProfile.id,
                    tenantId: newTenantProfile.tenant_id,
                    email: newTenantProfile.email,
                    serviceName: newTenantProfile.service_name,
                    address: newTenantProfile.address,
                    phoneNumber: newTenantProfile.phone_number,
                    logo: newTenantProfile.logo,
                    description: newTenantProfile.description,
                    facebookUrl: newTenantProfile.facebook_url,
                    instagramUrl: newTenantProfile.instagram_url,
                    youtubeUrl: newTenantProfile.youtube_url,
                    createdAt: newTenantProfile.createdAt.toISOString(),
                    updatedAt: newTenantProfile.updatedAt.toISOString(),
                },
            } ;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Kiểm tra mã lỗi cụ thể từ Prisma
                if (error.code === 'P2002') {
                    throw new GrpcAlreadyExistsException('TENANT_PROFILE_ALREADY_EXISTS');
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

    async findTenantProfileByTenantId(data: IFindTenantProfileByTenantIdRequest): Promise<IFindTenantProfileByIdResponse> {
        let {domain, tenantId } = data;
        try {
            // find TenantProfile by id and domain

            if (tenantId === undefined)
            {
                const Tenant = await this.prismaService.tenant.findFirst({
                    where: { domain: domain },
                });
    
                // check if Tenant not exists
                if (!Tenant) {
                    throw new GrpcItemNotFoundException('TENANT_NOT_FOUND');
                }

                tenantId = Tenant.id
            }

            const TenantProfile = await this.prismaService.tenantProfile.findFirst({
                where: { tenant_id: tenantId},
            });

            // check if TenantProfile not exists
            if (!TenantProfile) {
                throw new GrpcItemNotFoundException('TENANT_PROFILE_NOT_FOUND');
            }

            return {
                tenantProfile: {
                    id: TenantProfile.id,
                    tenantId: TenantProfile.tenant_id,
                    email: TenantProfile.email,
                    serviceName: TenantProfile.service_name,
                    address: TenantProfile.address,
                    phoneNumber: TenantProfile.phone_number,
                    logo: TenantProfile.logo,
                    description: TenantProfile.description,
                    facebookUrl: TenantProfile.facebook_url,
                    instagramUrl: TenantProfile.instagram_url,
                    youtubeUrl: TenantProfile.youtube_url,
                    createdAt: TenantProfile.createdAt.toISOString(),
                    updatedAt: TenantProfile.updatedAt.toISOString(),
                },
                // expireAt: newTenantProfile.expire_at
            } as ITenantProfileResponse;
        } catch (error) {
            throw error;
        }
    }

    async updateTenantProfile(data: IUpdateTenantProfileRequest): Promise<IUpdateTenantProfileResponse> {
        const { user, ...dataUpdate } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Find the TenantProfile first
            const TenantProfile = await this.prismaService.tenantProfile.findUnique({
                where: { id: dataUpdate.id },
            });

            // If the TenantProfile does not exist, throw an error
            if (!TenantProfile) {
                throw new GrpcItemNotFoundException('TENANT_PROFILE_NOT_FOUND');
            }
            let logo: string[] = undefined;
            if (dataUpdate.logo)
            {
                logo = await this.supabaseService.uploadImageAndGetLink([dataUpdate.logo]);
            }

            // If the TenantProfile exists, perform the update
            const updatedTenantProfile = await this.prismaService.tenantProfile.update({
                where: { id: dataUpdate.id },
                data: {
                    address: dataUpdate.address,
                    service_name: dataUpdate.serviceName,
                    phone_number: dataUpdate.phoneNumber,
                    logo: dataUpdate.logo? logo[0]: dataUpdate.logo,
                    description: dataUpdate.description,
                    facebook_url: dataUpdate.facebookUrl,
                    instagram_url: dataUpdate.instagramUrl,
                    youtube_url: dataUpdate.youtubeUrl,
                },
            });

            return {
                tenantProfile: {
                    id: updatedTenantProfile.id,
                    tenantId: updatedTenantProfile.tenant_id,
                    email: updatedTenantProfile.email,
                    serviceName: updatedTenantProfile.service_name,
                    address: updatedTenantProfile.address,
                    phoneNumber: updatedTenantProfile.phone_number,
                    logo: updatedTenantProfile.logo,
                    description: updatedTenantProfile.description,
                    facebookUrl: updatedTenantProfile.facebook_url,
                    instagramUrl: updatedTenantProfile.instagram_url,
                    youtubeUrl: updatedTenantProfile.youtube_url,
                    createdAt: updatedTenantProfile.createdAt.toISOString(),
                    updatedAt: updatedTenantProfile.updatedAt.toISOString(),
                },
                // expireAt: newTenantProfile.expire_at
            } as ITenantProfileResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteTenantProfile(data: IDeleteTenantProfileRequest): Promise<IDeleteTenantProfileResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the TenantProfile first
            const TenantProfile = await this.prismaService.tenantProfile.findUnique({
                where: { id: id },
            });

            // if the TenantProfile does not exist, throw an error
            if (!TenantProfile) {
                throw new GrpcItemNotFoundException('TENANT_PROFILE_NOT_FOUND');
            }

            // delete TenantProfile by id and domain
            const deletedTenantProfile = await this.prismaService.tenantProfile.delete({
                where: { id: id},
            });

            return {
                tenantProfile: {
                    id: deletedTenantProfile.id,
                    tenantId: deletedTenantProfile.tenant_id,
                    email: deletedTenantProfile.email,
                    serviceName: deletedTenantProfile.service_name,
                    address: deletedTenantProfile.address,
                    phoneNumber: deletedTenantProfile.phone_number,
                    logo: deletedTenantProfile.logo,
                    description: deletedTenantProfile.description,
                    facebookUrl: deletedTenantProfile.facebook_url,
                    instagramUrl: deletedTenantProfile.instagram_url,
                    youtubeUrl: deletedTenantProfile.youtube_url,
                    createdAt: deletedTenantProfile.createdAt.toISOString(),
                    updatedAt: deletedTenantProfile.updatedAt.toISOString(),
                },
                // expireAt: newTenantProfile.expire_at
            } as ITenantProfileResponse;
        } catch (error) {
            throw error;
        }
    }
}
