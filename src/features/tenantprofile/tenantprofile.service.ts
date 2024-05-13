import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreateTenantProfileRequest,
    ICreateTenantProfileResponse,
    IFindTenantProfileByIdRequest,
    IFindTenantProfileByIdResponse,
    IDeleteTenantProfileRequest,
    IDeleteTenantProfileResponse,
    IUpdateTenantProfileRequest,
    IUpdateTenantProfileResponse,
    ITenantProfileResponse,  
} from './interface/tenantprofile.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { TenantProfile } from 'src/proto_build/tenant/tenantprofile_pb';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';

@Injectable()
export class TenantProfileService {
    constructor(private prismaService: PrismaService,
        private supabaseService: SupabaseService
    ) {}

    async create(dataRequest: ICreateTenantProfileRequest): Promise<ICreateTenantProfileResponse> {
        const { user, ...data } = dataRequest;
        console.log(dataRequest);
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
            throw error;
        }
    }

    async findTenantProfileById(data: IFindTenantProfileByIdRequest): Promise<IFindTenantProfileByIdResponse> {
        const { id } = data;
        try {
            // find TenantProfile by id and domain
            const TenantProfile = await this.prismaService.tenantProfile.findUnique({
                where: { id: id},
            });

            // check if TenantProfile not exists
            if (!TenantProfile) {
                throw new GrpcItemNotFoundException('TenantProfile');
            }

            return {
                tenantProfile: {
                    id: TenantProfile.id,
                    tenantId: TenantProfile.tenant_id,
                    email: TenantProfile.email,
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
                throw new GrpcItemNotFoundException('TenantProfile_NOT_FOUND');
            }

            // If the TenantProfile exists, perform the update
            const updatedTenantProfile = await this.prismaService.tenantProfile.update({
                where: { id: dataUpdate.id },
                data: {
                    address: dataUpdate.address,
                    phone_number: dataUpdate.phoneNumber,
                    logo: dataUpdate.logo,
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
                throw new GrpcItemNotFoundException('TenantProfile');
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
