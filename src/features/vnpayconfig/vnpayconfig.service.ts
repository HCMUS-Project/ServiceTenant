import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import {
    GrpcInvalidArgumentException,
    GrpcItemNotFoundException,
} from 'src/common/exceptions/exceptions';
import { Prisma } from '@prisma/client';
import { CreateVNPayConfigRequest } from 'src/proto_build/tenant/vnpayconfig_pb';
import {
    ICreateVNPayConfigRequest,
    ICreateVNPayConfigResponse,
    IDeleteVNPayConfigRequest,
    IDeleteVNPayConfigResponse,
    IGetVNPayConfigByDomainRequest,
    IGetVNPayConfigByTenantIdResponse,
    IUpdateVNPayConfigRequest,
    IUpdateVNPayConfigResponse,
} from './interface/vnpayconfig.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';

@Injectable()
export class VNPayConfigService {
    constructor(private prismaService: PrismaService) {}

    async createVNPayConfig(
        dataRequest: ICreateVNPayConfigRequest,
    ): Promise<ICreateVNPayConfigResponse> {
        const { user, ...dataCreate } = dataRequest;
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            if (
                !(await this.prismaService.tenant.findFirst({
                    where: { id: dataCreate.tenantId },
                }))
            ) {
                throw new GrpcItemNotFoundException('TENANT_ID_NOT_FOUND');
            }
            if (
                await this.prismaService.vNPayConfig.findFirst({
                    where: { tenant_id: dataCreate.tenantId },
                })
            ) {
                throw new GrpcAlreadyExistsException('VN_PAY_CONFIG_ALREADY_EXISTS');
            }

            const newVNPayConfig = await this.prismaService.vNPayConfig.create({
                data: {
                    tenant_id: dataCreate.tenantId,
                    tmn_code: dataCreate.tmnCode,
                    secure_secret: dataCreate.secureSecret,
                    vnpay_host: dataCreate.vnpayHost,
                },
            });

            return {
                vnpayConfig: {
                    id: newVNPayConfig.id,
                    tenantId: newVNPayConfig.tenant_id,
                    tmnCode: newVNPayConfig.tmn_code,
                    secureSecret: newVNPayConfig.secure_secret,
                    vnpayHost: newVNPayConfig.vnpay_host,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async getVNPayConfigByTenantId(
        data: IGetVNPayConfigByDomainRequest,
    ): Promise<IGetVNPayConfigByTenantIdResponse> {
        const { domain } = data;
        try {
            const vnpayConfig = await this.prismaService.vNPayConfig.findFirst({
                where: { tenant: { domain: domain } },
            });

            if (!vnpayConfig) {
                throw new GrpcItemNotFoundException('VN_PAY_CONFIG_NOT_FOUND');
            }

            return {
                vnpayConfig: {
                    id: vnpayConfig.id,
                    tenantId: vnpayConfig.tenant_id,
                    tmnCode: vnpayConfig.tmn_code,
                    secureSecret: vnpayConfig.secure_secret,
                    vnpayHost: vnpayConfig.vnpay_host,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async updateVNPayConfig(data: IUpdateVNPayConfigRequest): Promise<IUpdateVNPayConfigResponse> {
        const { user, ...updateData } = data;

        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            const existingConfig = await this.prismaService.vNPayConfig.findUnique({
                where: { id: updateData.id },
            });

            if (!existingConfig) {
                throw new GrpcItemNotFoundException('VN_PAY_CONFIG_NOT_FOUND');
            }
            if (
                !(await this.prismaService.tenant.findFirst({
                    where: { id: updateData.tenantId },
                }))
            ) {
                throw new GrpcItemNotFoundException('TENANT_ID_NOT_FOUND');
            }
            const updatedConfig = await this.prismaService.vNPayConfig.update({
                where: { id: updateData.id },
                data: {
                    tenant_id: updateData.tenantId,
                    tmn_code: updateData.tmnCode,
                    secure_secret: updateData.secureSecret,
                    vnpay_host: updateData.vnpayHost,
                },
            });
            return {
                vnpayConfig: {
                    id: updatedConfig.id,
                    tenantId: updatedConfig.tenant_id,
                    tmnCode: updatedConfig.tmn_code,
                    secureSecret: updatedConfig.secure_secret,
                    vnpayHost: updatedConfig.vnpay_host,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteVNPayConfig(data: IDeleteVNPayConfigRequest): Promise<IDeleteVNPayConfigResponse> {
        const { user, id } = data;

        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            const existingConfig = await this.prismaService.vNPayConfig.findUnique({
                where: { id },
            });

            if (!existingConfig) {
                throw new GrpcItemNotFoundException('VN_PAY_CONFIG_NOT_FOUND');
            }

            await this.prismaService.vNPayConfig.delete({
                where: { id },
            });

            return {
                vnpayConfig: {
                    id: existingConfig.id,
                    tenantId: existingConfig.tenant_id,
                    tmnCode: existingConfig.tmn_code,
                    secureSecret: existingConfig.secure_secret,
                    vnpayHost: existingConfig.vnpay_host,
                },
            };
        } catch (error) {
            throw error;
        }
    }
}
