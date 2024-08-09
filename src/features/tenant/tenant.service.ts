import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreateTenantRequest,
    ICreateTenantResponse,
    IFindTenantByIdRequest,
    IFindTenantByIdResponse,
    IDeleteTenantRequest,
    IDeleteTenantResponse,
    IUpdateTenantRequest,
    IUpdateTenantResponse,
    ITenant,
    ITenantResponse,
    IFindTenantByDomainRequest,
    IFindTenantByDomainResponse,
} from './interface/tenant.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { Tenant } from 'src/proto_build/tenant/tenant_pb';
import { GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';

@Injectable()
export class TenantService {
    constructor(private prismaService: PrismaService) {}

    async create(dataRequest: ICreateTenantRequest): Promise<ICreateTenantResponse> {
        const { user, ...data } = dataRequest;
        // console.log(dataRequest);
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // check if category name already exists
            if (
                await this.prismaService.tenant.findUnique({
                    where: { domain: user.domain, owner_id: user.email },
                })
            ) {
                throw new GrpcAlreadyExistsException('TENANT_ALREADY_EXISTS');
            }

            // create Tenant
            const newTenant = await this.prismaService.tenant.create({
                data: {
                    domain: user.domain,
                    owner_id: user.email,
                    name: data.name,
                },
            });

            // create vnpayconfig
            const newVNPayConfig = await this.prismaService.vNPayConfig.create({
                data: {
                    tenant_id: newTenant.id,
                    vnpay_host: 'https://sandbox.vnpayment.vn',
                    tmn_code: 'default terminal code',
                    secure_secret: 'default secure secret',
                },
            });

            return {
                tenant: {
                    id: newTenant.id,
                    ownerId: newTenant.owner_id,
                    name: newTenant.name,
                    isLocked: newTenant.is_locked,
                    createdAt: newTenant.createdAt.toISOString(),
                    updatedAt: newTenant.updatedAt.toISOString(),
                    domain: newTenant.domain,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async findTenantById(data: IFindTenantByIdRequest): Promise<IFindTenantByIdResponse> {
        const { id } = data;
        try {
            // find Tenant by id and domain
            const Tenant = await this.prismaService.tenant.findUnique({
                where: { id: id },
            });

            // check if Tenant not exists
            if (!Tenant) {
                throw new GrpcItemNotFoundException('TENANT_NOT_FOUND');
            }

            return {
                tenant: {
                    id: Tenant.id,
                    ownerId: Tenant.owner_id,
                    name: Tenant.name,
                    isLocked: Tenant.is_locked,
                    createdAt: Tenant.createdAt.toISOString(),
                    updatedAt: Tenant.updatedAt.toISOString(),
                    domain: Tenant.domain,
                },
                // expireAt: newTenant.expire_at
            } as ITenantResponse;
        } catch (error) {
            throw error;
        }
    }

    async findTenantByDomain(
        data: IFindTenantByDomainRequest,
    ): Promise<IFindTenantByDomainResponse> {
        const { user } = data;
        try {
            // find Tenant by id and domain
            const Tenant = await this.prismaService.tenant.findFirst({
                where: { domain: user.domain },
            });

            // check if Tenant not exists
            // if (!Tenant) {
            //     throw new GrpcItemNotFoundException('TENANT_NOT_FOUND');
            // }

            return Tenant
                ? ({
                      tenant: {
                          id: Tenant.id,
                          ownerId: Tenant.owner_id,
                          name: Tenant.name,
                          isLocked: Tenant.is_locked,
                          createdAt: Tenant.createdAt.toISOString(),
                          updatedAt: Tenant.updatedAt.toISOString(),
                          domain: Tenant.domain,
                      },
                      // expireAt: newTenant.expire_at
                  } as ITenantResponse)
                : { tenant: undefined };
        } catch (error) {
            throw error;
        }
    }

    async updateTenant(data: IUpdateTenantRequest): Promise<IUpdateTenantResponse> {
        const { user, ...dataUpdate } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Find the Tenant first
            const Tenant = await this.prismaService.tenant.findUnique({
                where: { id: dataUpdate.id, domain: user.domain },
            });

            // If the Tenant does not exist, throw an error
            if (!Tenant) {
                throw new GrpcItemNotFoundException('TENANT_NOT_FOUND');
            }

            // If the Tenant exists, perform the update
            const updatedTenant = await this.prismaService.tenant.update({
                where: { id: dataUpdate.id, domain: user.domain },
                data: {
                    name: dataUpdate.name,
                },
            });

            return {
                tenant: {
                    id: updatedTenant.id,
                    ownerId: updatedTenant.owner_id,
                    name: updatedTenant.name,
                    isLocked: updatedTenant.is_locked,
                    createdAt: updatedTenant.createdAt.toISOString(),
                    updatedAt: updatedTenant.updatedAt.toISOString(),
                    domain: updatedTenant.domain,
                },
                // expireAt: newTenant.expire_at
            } as ITenantResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteTenant(data: IDeleteTenantRequest): Promise<IDeleteTenantResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the Tenant first
            const Tenant = await this.prismaService.tenant.findUnique({
                where: { id: id, domain: user.domain },
            });

            // if the Tenant does not exist, throw an error
            if (!Tenant) {
                throw new GrpcItemNotFoundException('TENANT_NOT_FOUND');
            }

            // delete Tenant by id and domain
            const deletedTenant = await this.prismaService.tenant.delete({
                where: { id, domain: user.domain },
            });

            return {
                tenant: {
                    id: deletedTenant.id,
                    ownerId: deletedTenant.owner_id,
                    name: deletedTenant.name,
                    isLocked: deletedTenant.is_locked,
                    createdAt: deletedTenant.createdAt.toISOString(),
                    updatedAt: deletedTenant.updatedAt.toISOString(),
                    domain: deletedTenant.domain,
                },
                // expireAt: newTenant.expire_at
            } as ITenantResponse;
        } catch (error) {
            throw error;
        }
    }
}
