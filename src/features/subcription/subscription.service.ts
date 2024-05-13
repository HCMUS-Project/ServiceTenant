import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICreateSubscriptionRequest,
    ICreateSubscriptionResponse,
    IFindSubscriptionByTenantIdRequest,
    IFindSubscriptionByIdResponse,
    IDeleteSubscriptionRequest,
    IDeleteSubscriptionResponse,
    IUpdateSubscriptionRequest,
    IUpdateSubscriptionResponse,
    ISubscriptionResponse,
} from './interface/subscription.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { Subscription } from 'src/proto_build/tenant/subscription_pb';
import { GrpcInvalidArgumentException, GrpcItemNotFoundException } from 'src/common/exceptions/exceptions';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
    constructor(private prismaService: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async create(dataRequest: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse> {
        const { user, ...data } = dataRequest;
        
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // check if category name already exists
            if (
                await this.prismaService.subscription.findFirst({
                    where: { tenant_id: data.tenantId },
                })
            ) {
                throw new GrpcAlreadyExistsException('SUBSCRIPTION_ALREADY_EXISTS');
            }

            // create Subscription
            const newSubscription = await this.prismaService.subscription.create({
                data: {
                    tenant_id: data.tenantId,
                    value: data.value,
                    next_billing: data.nextBilling,
                },
            });

            return {
                subscription: {
                    id: newSubscription.id,
                    tenantId: newSubscription.tenant_id,
                    value: newSubscription.value,
                    nextBilling: newSubscription.next_billing.toISOString(),
                    createdAt: newSubscription.createdAt.toISOString(),
                    updatedAt: newSubscription.updatedAt.toISOString(),
                },
            } ;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Kiểm tra mã lỗi cụ thể từ Prisma
                if (error.code === 'P2002') {
                    throw new GrpcAlreadyExistsException('SUBSCRIPTION_ALREADY_EXISTS');
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

    async findSubscriptionByTenantId(data: IFindSubscriptionByTenantIdRequest): Promise<IFindSubscriptionByIdResponse> {
        const { tenantId } = data;
        try {
            // find Subscription by id and domain
            const Subscription = await this.prismaService.subscription.findFirst({
                where: { tenant_id: tenantId },
            });

            // check if Subscription not exists
            if (!Subscription) {
                throw new GrpcItemNotFoundException('SUBSCRIPTION_NOT_FOUND');
            }

            return {
                subscription: {
                    id: Subscription.id,
                    tenantId: Subscription.tenant_id,
                    value: Subscription.value,
                    nextBilling: Subscription.next_billing.toISOString(),
                    createdAt: Subscription.createdAt.toISOString(),
                    updatedAt: Subscription.updatedAt.toISOString(),
                },
                // expireAt: newSubscription.expire_at
            } as ISubscriptionResponse;
        } catch (error) {
            throw error;
        }
    }

    async updateSubscription(data: IUpdateSubscriptionRequest): Promise<IUpdateSubscriptionResponse> {
        const { user, ...dataUpdate } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // Find the Subscription first
            const Subscription = await this.prismaService.subscription.findUnique({
                where: { id: dataUpdate.id},
            });

            // If the Subscription does not exist, throw an error
            if (!Subscription) {
                throw new GrpcItemNotFoundException('SUBSCRIPTION_NOT_FOUND');
            }

            // If the Subscription exists, perform the update
            const updatedSubscription = await this.prismaService.subscription.update({
                where: { id: dataUpdate.id},
                data: {
                    value: dataUpdate.value,
                    next_billing: dataUpdate.nextBilling,
                },
            });

            return {
                subscription: {
                    id: updatedSubscription.id,
                    tenantId: updatedSubscription.tenant_id,
                    value: updatedSubscription.value,
                    nextBilling: updatedSubscription.next_billing.toISOString(),
                    createdAt: updatedSubscription.createdAt.toISOString(),
                    updatedAt: updatedSubscription.updatedAt.toISOString(),
                },
                // expireAt: newSubscription.expire_at
            } as ISubscriptionResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteSubscription(data: IDeleteSubscriptionRequest): Promise<IDeleteSubscriptionResponse> {
        const { user, id } = data;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }

        try {
            // find the Subscription first
            const Subscription = await this.prismaService.subscription.findUnique({
                where: { id: id },
            });

            // if the Subscription does not exist, throw an error
            if (!Subscription) {
                throw new GrpcItemNotFoundException('SUBSCRIPTION_NOT_FOUND');
            }

            // delete Subscription by id and domain
            const deletedSubscription = await this.prismaService.subscription.delete({
                where: { id: id },
            });

            return {
                subscription: {
                    id: deletedSubscription.id,
                    tenantId: deletedSubscription.tenant_id,
                    value: deletedSubscription.value,
                    nextBilling: deletedSubscription.next_billing.toISOString(),
                    createdAt: deletedSubscription.createdAt.toISOString(),
                    updatedAt: deletedSubscription.updatedAt.toISOString(),
                },
                // expireAt: newSubscription.expire_at
            } as ISubscriptionResponse;
        } catch (error) {
            throw error;
        }
    }
}
