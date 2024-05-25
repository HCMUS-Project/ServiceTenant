import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreatePolicyAndTermRequest,
    ICreatePolicyAndTermResponse,
    IFindPolicyAndTermByTenantIdRequest,
    IFindPolicyAndTermByIdResponse,
    IDeletePolicyAndTermRequest,
    IDeletePolicyAndTermResponse,
    IUpdatePolicyAndTermRequest,
    IUpdatePolicyAndTermResponse,
    IPolicyAndTermResponse,
} from './interface/policyandterm.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { PolicyAndTerm } from 'src/proto_build/tenant/policyandterm_pb';
import {
    GrpcInvalidArgumentException,
    GrpcItemNotFoundException,
} from 'src/common/exceptions/exceptions';
import { Prisma } from '@prisma/client';

@Injectable()
export class PolicyAndTermService {
    constructor(private prismaService: PrismaService) {}

    async create(dataRequest: ICreatePolicyAndTermRequest): Promise<ICreatePolicyAndTermResponse> {
        const { user, ...data } = dataRequest;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // check if category name already exists
            if (
                await this.prismaService.policyAndTerm.findFirst({
                    where: { tenant_id: data.tenantId },
                })
            ) {
                throw new GrpcAlreadyExistsException('POLICY_AND_TERM_ALREADY_EXISTS');
            }

            // create PolicyAndTerm
            const newPolicyAndTerm = await this.prismaService.policyAndTerm.create({
                data: {
                    tenant_id: data.tenantId,
                    policy: data.policy,
                    term: data.term,
                },
            });

            return {
                policyAndTerm: {
                    id: newPolicyAndTerm.id,
                    tenantId: newPolicyAndTerm.tenant_id,
                    policy: newPolicyAndTerm.policy,
                    term: newPolicyAndTerm.term,
                    createdAt: newPolicyAndTerm.createdAt.toISOString(),
                    updatedAt: newPolicyAndTerm.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Kiểm tra mã lỗi cụ thể từ Prisma
                if (error.code === 'P2002') {
                    throw new GrpcAlreadyExistsException('POLICY_AND_TERM_ALREADY_EXISTS');
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

    async findPolicyAndTermByTenantId(
        data: IFindPolicyAndTermByTenantIdRequest,
    ): Promise<IFindPolicyAndTermByIdResponse> {
        const { tenantId } = data;
        try {
            // find PolicyAndTerm by id and domain
            const PolicyAndTerm = await this.prismaService.policyAndTerm.findFirst({
                where: { tenant_id: tenantId },
            });

            // check if PolicyAndTerm not exists
            if (!PolicyAndTerm) {
                throw new GrpcItemNotFoundException('POLICY_AND_TERM_NOT_FOUND');
            }

            return {
                policyAndTerm: {
                    id: PolicyAndTerm.id,
                    tenantId: PolicyAndTerm.tenant_id,
                    policy: PolicyAndTerm.policy,
                    term: PolicyAndTerm.term,
                    createdAt: PolicyAndTerm.createdAt.toISOString(),
                    updatedAt: PolicyAndTerm.updatedAt.toISOString(),
                },
                // expireAt: newPolicyAndTerm.expire_at
            } as IPolicyAndTermResponse;
        } catch (error) {
            throw error;
        }
    }

    async updatePolicyAndTerm(
        data: IUpdatePolicyAndTermRequest,
    ): Promise<IUpdatePolicyAndTermResponse> {
        const { user, ...dataUpdate } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Find the PolicyAndTerm first
            const PolicyAndTerm = await this.prismaService.policyAndTerm.findUnique({
                where: { id: dataUpdate.id },
            });

            // If the PolicyAndTerm does not exist, throw an error
            if (!PolicyAndTerm) {
                throw new GrpcItemNotFoundException('POLICY_AND_TERM_NOT_FOUND');
            }

            // If the PolicyAndTerm exists, perform the update
            const updatedPolicyAndTerm = await this.prismaService.policyAndTerm.update({
                where: { id: dataUpdate.id },
                data: {
                    policy: dataUpdate.policy,
                    term: dataUpdate.term,
                },
            });

            return {
                policyAndTerm: {
                    id: updatedPolicyAndTerm.id,
                    tenantId: updatedPolicyAndTerm.tenant_id,
                    policy: updatedPolicyAndTerm.policy,
                    term: updatedPolicyAndTerm.term,
                    createdAt: updatedPolicyAndTerm.createdAt.toISOString(),
                    updatedAt: updatedPolicyAndTerm.updatedAt.toISOString(),
                },
                // expireAt: newPolicyAndTerm.expire_at
            } as IPolicyAndTermResponse;
        } catch (error) {
            throw error;
        }
    }

    async deletePolicyAndTerm(
        data: IDeletePolicyAndTermRequest,
    ): Promise<IDeletePolicyAndTermResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the PolicyAndTerm first
            const PolicyAndTerm = await this.prismaService.policyAndTerm.findUnique({
                where: { id: id },
            });

            // if the PolicyAndTerm does not exist, throw an error
            if (!PolicyAndTerm) {
                throw new GrpcItemNotFoundException('POLICY_AND_TERM_NOT_FOUND');
            }

            // delete PolicyAndTerm by id and domain
            const deletedPolicyAndTerm = await this.prismaService.policyAndTerm.delete({
                where: { id: id },
            });

            return {
                policyAndTerm: {
                    id: deletedPolicyAndTerm.id,
                    tenantId: deletedPolicyAndTerm.tenant_id,
                    policy: deletedPolicyAndTerm.policy,
                    term: deletedPolicyAndTerm.term,
                    createdAt: deletedPolicyAndTerm.createdAt.toISOString(),
                    updatedAt: deletedPolicyAndTerm.updatedAt.toISOString(),
                },
                // expireAt: newPolicyAndTerm.expire_at
            } as IPolicyAndTermResponse;
        } catch (error) {
            throw error;
        }
    }
}
