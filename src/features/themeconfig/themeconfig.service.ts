import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreateThemeConfigRequest,
    ICreateThemeConfigResponse,
    IFindThemeConfigByTenantIdRequest,
    IFindThemeConfigByIdResponse,
    IDeleteThemeConfigRequest,
    IDeleteThemeConfigResponse,
    IUpdateThemeConfigRequest,
    IUpdateThemeConfigResponse,
    IThemeConfigResponse,
} from './interface/themeconfig.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { ThemeConfig } from 'src/proto_build/tenant/themeconfig_pb';
import { GrpcInvalidArgumentException, GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ThemeConfigService {
    constructor(private prismaService: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async create(dataRequest: ICreateThemeConfigRequest): Promise<ICreateThemeConfigResponse> {
        const { user, ...data } = dataRequest;
        
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // check if category name already exists
            if (
                await this.prismaService.themeConfig.findFirst({
                    where: { tenant_id: data.tenantId },
                })
            ) {
                throw new GrpcAlreadyExistsException('THEME_CONFIG_ALREADY_EXISTS');
            }

            // create ThemeConfig
            const newThemeConfig = await this.prismaService.themeConfig.create({
                data: {
                    tenant_id: data.tenantId,
                    header_color: data.headerColor,
                    header_text_color: data.headerTextColor,
                    body_color: data.bodyColor,
                    body_text_color: data.bodyTextColor,
                    footer_color: data.footerColor,
                    footer_text_color: data.footerTextColor,
                    text_font: data.textFont,
                    button_color: data.buttonColor,
                    button_text_color: data.buttonTextColor,
                    button_radius: data.buttonRadius,
                },
            });

            return {
                themeConfig: {
                    id: newThemeConfig.id,
                    tenantId: newThemeConfig.tenant_id,
                    headerColor: newThemeConfig.header_color,
                    headerTextColor: newThemeConfig.header_text_color,
                    bodyColor: newThemeConfig.body_color,
                    bodyTextColor: newThemeConfig.body_text_color,
                    footerColor: newThemeConfig.footer_color,
                    footerTextColor: newThemeConfig.footer_text_color,
                    textFont: newThemeConfig.text_font,
                    buttonColor: newThemeConfig.button_color,
                    buttonTextColor: newThemeConfig.button_text_color,
                    buttonRadius: newThemeConfig.button_radius,
                    createdAt: newThemeConfig.createdAt.toISOString(),
                    updatedAt: newThemeConfig.updatedAt.toISOString(),
                },
            } ;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Kiểm tra mã lỗi cụ thể từ Prisma
                if (error.code === 'P2002') {
                    throw new GrpcAlreadyExistsException('THEME_CONFIG_ALREADY_EXISTS');
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

    async findThemeConfigByTenantId(data: IFindThemeConfigByTenantIdRequest): Promise<IFindThemeConfigByIdResponse> {
        let {domain, tenantId } = data;
        try {
            // find ThemeConfig by id and domain

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

            const ThemeConfig = await this.prismaService.themeConfig.findFirst({
                where: { tenant_id: tenantId },
            });

            // check if ThemeConfig not exists
            if (!ThemeConfig) {
                throw new GrpcItemNotFoundException('THEME_CONFIG_NOT_FOUND');
            }

            return {
                themeConfig: {
                    id: ThemeConfig.id,
                    tenantId: ThemeConfig.tenant_id,
                    headerColor: ThemeConfig.header_color,
                    headerTextColor: ThemeConfig.header_text_color,
                    bodyColor: ThemeConfig.body_color,
                    bodyTextColor: ThemeConfig.body_text_color,
                    footerColor: ThemeConfig.footer_color,
                    footerTextColor: ThemeConfig.footer_text_color,
                    textFont: ThemeConfig.text_font,
                    buttonColor: ThemeConfig.button_color,
                    buttonTextColor: ThemeConfig.button_text_color,
                    buttonRadius: ThemeConfig.button_radius,
                    createdAt: ThemeConfig.createdAt.toISOString(),
                    updatedAt: ThemeConfig.updatedAt.toISOString(),
                },
                // expireAt: newThemeConfig.expire_at
            } as IThemeConfigResponse;
        } catch (error) {
            throw error;
        }
    }

    async updateThemeConfig(data: IUpdateThemeConfigRequest): Promise<IUpdateThemeConfigResponse> {
        const { user, ...dataUpdate } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Find the ThemeConfig first
            const ThemeConfig = await this.prismaService.themeConfig.findUnique({
                where: { id: dataUpdate.id},
            });

            // If the ThemeConfig does not exist, throw an error
            if (!ThemeConfig) {
                throw new GrpcItemNotFoundException('THEME_CONFIG_NOT_FOUND');
            }

            // If the ThemeConfig exists, perform the update
            const updatedThemeConfig = await this.prismaService.themeConfig.update({
                where: { id: dataUpdate.id},
                data: {
                    id: dataUpdate.id,
                    tenant_id: dataUpdate.tenantId,
                    header_color: dataUpdate.headerColor,
                    header_text_color: dataUpdate.headerTextColor,
                    body_color: dataUpdate.bodyColor,
                    body_text_color: dataUpdate.bodyTextColor,
                    footer_color: dataUpdate.footerColor,
                    footer_text_color: dataUpdate.footerTextColor,
                    text_font: dataUpdate.textFont,
                    button_color: dataUpdate.buttonColor,
                    button_text_color: dataUpdate.buttonTextColor,
                    button_radius: dataUpdate.buttonRadius,
                },
            });

            return {
                themeConfig: {
                    id: updatedThemeConfig.id,
                    tenantId: updatedThemeConfig.tenant_id,
                    headerColor: updatedThemeConfig.header_color,
                    headerTextColor: updatedThemeConfig.header_text_color,
                    bodyColor: updatedThemeConfig.body_color,
                    bodyTextColor: updatedThemeConfig.body_text_color,
                    footerColor: updatedThemeConfig.footer_color,
                    footerTextColor: updatedThemeConfig.footer_text_color,
                    textFont: updatedThemeConfig.text_font,
                    buttonColor: updatedThemeConfig.button_color,
                    buttonTextColor: updatedThemeConfig.button_text_color,
                    buttonRadius: updatedThemeConfig.button_radius,
                    createdAt: updatedThemeConfig.createdAt.toISOString(),
                    updatedAt: updatedThemeConfig.updatedAt.toISOString(),
                },
                // expireAt: newThemeConfig.expire_at
            } as IThemeConfigResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteThemeConfig(data: IDeleteThemeConfigRequest): Promise<IDeleteThemeConfigResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the ThemeConfig first
            const ThemeConfig = await this.prismaService.themeConfig.findUnique({
                where: { id: id },
            });

            // if the ThemeConfig does not exist, throw an error
            if (!ThemeConfig) {
                throw new GrpcItemNotFoundException('THEME_CONFIG_NOT_FOUND');
            }

            // delete ThemeConfig by id and domain
            const deletedThemeConfig = await this.prismaService.themeConfig.delete({
                where: { id: id },
            });

            return {
                themeConfig: {
                    id: deletedThemeConfig.id,
                    tenantId: deletedThemeConfig.tenant_id,
                    headerColor: deletedThemeConfig.header_color,
                    headerTextColor: deletedThemeConfig.header_text_color,
                    bodyColor: deletedThemeConfig.body_color,
                    bodyTextColor: deletedThemeConfig.body_text_color,
                    footerColor: deletedThemeConfig.footer_color,
                    footerTextColor: deletedThemeConfig.footer_text_color,
                    textFont: deletedThemeConfig.text_font,
                    buttonColor: deletedThemeConfig.button_color,
                    buttonTextColor: deletedThemeConfig.button_text_color,
                    buttonRadius: deletedThemeConfig.button_radius,
                    createdAt: deletedThemeConfig.createdAt.toISOString(),
                    updatedAt: deletedThemeConfig.updatedAt.toISOString(),
                },
                // expireAt: newThemeConfig.expire_at
            } as IThemeConfigResponse;
        } catch (error) {
            throw error;
        }
    }
}
