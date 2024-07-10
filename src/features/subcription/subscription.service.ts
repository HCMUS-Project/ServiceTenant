import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
    ICancelSubscriptionRequest,
    ICancelSubscriptionResponse,
    ICreateSubscriptionRequest,
    ICreateSubscriptionResponse,
    IFindAllSubscriptionByQueryAdminRequest,
    IFindAllSubscriptionByQueryRequest,
    IFindAllSubscriptionResponse,
    IFindPlansRequest,
    IFindPlansResponse,
    ISubscriptionResponse,
    IUpdateSubscriptionStageByAdminRequest,
    IUpdateSubscriptionStageByAdminResponse,
} from './interface/subscription.interface';

import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { GrpcAlreadyExistsException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions';
import { Role } from 'src/proto_build/auth/user_token_pb';
import { Stage, Subscription } from 'src/proto_build/tenant/subscription_pb';
import {
    GrpcInvalidArgumentException,
    GrpcItemNotFoundException,
} from 'src/common/exceptions/exceptions';
import { SupabaseService } from 'src/util/supabase/supabase.service';
import { Prisma } from '@prisma/client';
import { Tenant } from 'src/proto_build/tenant/tenant_pb';
import { ICreatePaymentUrlRequest } from '../externalServices/payment_service/payment.interface';
import {PaymentTenantService} from '../externalServices/payment_service/payment.service';

@Injectable()
export class SubscriptionService {
    constructor(
        private prismaService: PrismaService,
        private supabaseService: SupabaseService,
        private paymentTenantService: PaymentTenantService,
    ) {}

    async create(dataRequest: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse> {
        const { user, ...data } = dataRequest;

        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            // find the tenant first
            const Tenant = await this.prismaService.tenant.findUnique({
                where: { id: data.tenantId },
            });

            // if the Subscription does not exist, throw an error
            if (!Tenant) {
                throw new GrpcItemNotFoundException('TENANT_NOT_FOUND');
            }
            // check if subscription name already exists
            if (
                await this.prismaService.subscription.findFirst({
                    where: { tenant_id: data.tenantId, stage: { not: 'CANCELLED' } },
                })
            ) {
                throw new GrpcAlreadyExistsException('EXISTING_SUBSCRIPTION_NOT_CANCELLED');
            }

            const plan = await this.prismaService.plan.findFirst({
                where: { name: data.planName },
            });

            if (!plan) {
                throw new GrpcAlreadyExistsException('PLAN_NOT_FOUND');
            }

            let next_billing = new Date();
            next_billing.setMonth(next_billing.getMonth() + plan.limit_of_month);
            // create Subscription
            const newSubscription = await this.prismaService.subscription.create({
                data: {
                    tenant_id: data.tenantId,
                    total_value: plan.price_per_month * plan.limit_of_month,
                    stage: 'PENDING',
                    plan_name: data.planName,
                    next_billing: next_billing,
                },
            });

            // Call payment service to create payment url
            const dataCreatePaymentUrl: ICreatePaymentUrlRequest = {
                amount: plan.price_per_month * plan.limit_of_month,
                description: 'Payment for Tenant Subscription',
                orderBookingId: [],
                orderProductsId: [newSubscription.id],
                paymentMethodId: data.paymentMethod,
                // vnpReturnUrl: this.configService.get('vnpayCallback'),
                vnpReturnUrl: data.paymentCallbackUrl,
                user: user,
            };
            const url = await this.paymentTenantService.createPaymentUrl(dataCreatePaymentUrl);

            return {
                subscription: {
                    id: newSubscription.id,
                    tenantId: newSubscription.tenant_id,
                    totalValue: newSubscription.total_value,
                    stage: newSubscription.stage,
                    plan: {
                        name: plan.name,
                        pricePerMonth: plan.price_per_month,
                        limitOfMonth: plan.limit_of_month,
                        limitOfServices: plan.limit_of_services,
                        limitOfEmployees: plan.limit_of_employees,
                        limitOfProducts: plan.limit_of_products,
                        feePercentPerTransaction: plan.fee_percent_per_transaction,
                    },
                    nextBilling: newSubscription.next_billing.toISOString(),
                    createdAt: newSubscription.createdAt.toISOString(),
                    updatedAt: newSubscription.updatedAt.toISOString(),
                    domain: user.domain,
                },
                paymentUrl: url.paymentUrl
            };
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

    async findAllSubscriptionByQuery(
        data: IFindAllSubscriptionByQueryRequest,
    ): Promise<IFindAllSubscriptionResponse> {
        const { user, tenantId, stage } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            const stageConvert = stage ? stage.toString() : undefined;

            // find Subscription by id and domain
            const Subscriptions = await this.prismaService.subscription.findMany({
                where: { tenant_id: tenantId, stage: stageConvert },
                include: {
                    plan: true,
                    tenant: {
                        select: {
                            domain: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return {
                subscriptions: Subscriptions.map(subcription => ({
                    id: subcription.id,
                    tenantId: subcription.tenant_id,
                    totalValue: subcription.total_value,
                    stage: subcription.stage,
                    plan: {
                        name: subcription.plan.name,
                        pricePerMonth: subcription.plan.price_per_month,
                        limitOfMonth: subcription.plan.limit_of_month,
                        limitOfServices: subcription.plan.limit_of_services,
                        limitOfEmployees: subcription.plan.limit_of_employees,
                        limitOfProducts: subcription.plan.limit_of_products,
                        feePercentPerTransaction: subcription.plan.fee_percent_per_transaction,
                    },
                    domain: subcription.tenant.domain,
                    nextBilling: subcription.next_billing.toISOString(),
                    createdAt: subcription.createdAt.toISOString(),
                    updatedAt: subcription.updatedAt.toISOString(),
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async findAllSubscriptionByQueryAdmin(
        data: IFindAllSubscriptionByQueryAdminRequest,
    ): Promise<IFindAllSubscriptionResponse> {
        const { user, ...query } = data;
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.ADMIN)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            const tenantIds = (
                await this.prismaService.tenant.findMany({
                    where: {
                        domain: query.domain,
                    },
                    select: {
                        id: true,
                    },
                })
            ).map(tenant => tenant.id);

            const stageConvert = query.stage ? query.stage.toString() : undefined;
            // find Subscription by id and domain
            const Subscriptions = await this.prismaService.subscription.findMany({
                where: {
                    tenant_id: {
                        in: tenantIds,
                    },
                    stage: stageConvert,
                    plan_name: query.planName,
                },
                include: {
                    plan: true,
                    tenant: {
                        select: {
                            domain: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return {
                subscriptions: Subscriptions.map(subcription => ({
                    id: subcription.id,
                    tenantId: subcription.tenant_id,
                    totalValue: subcription.total_value,
                    stage: subcription.stage,
                    domain: subcription.tenant.domain,
                    plan: {
                        name: subcription.plan.name,
                        pricePerMonth: subcription.plan.price_per_month,
                        limitOfMonth: subcription.plan.limit_of_month,
                        limitOfServices: subcription.plan.limit_of_services,
                        limitOfEmployees: subcription.plan.limit_of_employees,
                        limitOfProducts: subcription.plan.limit_of_products,
                        feePercentPerTransaction: subcription.plan.fee_percent_per_transaction,
                    },
                    nextBilling: subcription.next_billing.toISOString(),
                    createdAt: subcription.createdAt.toISOString(),
                    updatedAt: subcription.updatedAt.toISOString(),
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async findPlans(data: IFindPlansRequest): Promise<IFindPlansResponse> {
        try {
            // find all Plans
            const plans = await this.prismaService.plan.findMany({});

            return {
                plans: plans.map(plan => ({
                    name: plan.name,
                    pricePerMonth: plan.price_per_month,
                    limitOfMonth: plan.limit_of_month,
                    limitOfServices: plan.limit_of_services,
                    limitOfEmployees: plan.limit_of_employees,
                    limitOfProducts: plan.limit_of_products,
                    feePercentPerTransaction: plan.fee_percent_per_transaction,
                })),
            };
        } catch (error) {
            throw error;
        }
    }

    async updateSubscriptionStageByAdmin(
        data: IUpdateSubscriptionStageByAdminRequest,
    ): Promise<IUpdateSubscriptionStageByAdminResponse> {
        const { user, ...dataUpdate } = data;
        // console.log(data)
        // check role of user
        if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.ADMIN)) {
            throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
        }
        try {
            const stageConvert = dataUpdate.stage ? dataUpdate.stage.toString() : undefined;
            // Find the Subscription first
            const Subscription = await this.prismaService.subscription.findUnique({
                where: {
                    id: dataUpdate.id,
                    tenant_id: dataUpdate.tenantId,
                },
            });

            // If the Subscription does not exist, throw an error
            if (!Subscription) {
                throw new GrpcItemNotFoundException('SUBSCRIPTION_NOT_FOUND');
            }

            // If the Subscription exists, perform the update
            const updatedSubscription = await this.prismaService.subscription.update({
                where: { id: dataUpdate.id },
                data: {
                    stage: stageConvert,
                },
                include: {
                    plan: true,
                    tenant: {
                        select: {
                            domain: true,
                        },
                    },
                },
            });

            return {
                subscription: {
                    id: updatedSubscription.id,
                    tenantId: updatedSubscription.tenant_id,
                    totalValue: updatedSubscription.total_value,
                    stage: updatedSubscription.stage,
                    plan: {
                        name: updatedSubscription.plan.name,
                        pricePerMonth: updatedSubscription.plan.price_per_month,
                        limitOfMonth: updatedSubscription.plan.limit_of_month,
                        limitOfServices: updatedSubscription.plan.limit_of_services,
                        limitOfEmployees: updatedSubscription.plan.limit_of_employees,
                        limitOfProducts: updatedSubscription.plan.limit_of_products,
                        feePercentPerTransaction:
                            updatedSubscription.plan.fee_percent_per_transaction,
                    },
                    domain: updatedSubscription.tenant.domain,
                    nextBilling: updatedSubscription.next_billing.toISOString(),
                    createdAt: updatedSubscription.createdAt.toISOString(),
                    updatedAt: updatedSubscription.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async cancelSubscription(
        data: ICancelSubscriptionRequest,
    ): Promise<ICancelSubscriptionResponse> {
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

            // If the Subscription exists, perform the update
            const updatedSubscription = await this.prismaService.subscription.update({
                where: { id: Subscription.id },
                data: {
                    stage: 'CANCELLED',
                },
                include: {
                    plan: true,
                    tenant: {
                        select: { domain: true },
                    },
                },
            });

            return {
                subscription: {
                    id: updatedSubscription.id,
                    tenantId: updatedSubscription.tenant_id,
                    totalValue: updatedSubscription.total_value,
                    stage: updatedSubscription.stage,
                    plan: {
                        name: updatedSubscription.plan.name,
                        pricePerMonth: updatedSubscription.plan.price_per_month,
                        limitOfMonth: updatedSubscription.plan.limit_of_month,
                        limitOfServices: updatedSubscription.plan.limit_of_services,
                        limitOfEmployees: updatedSubscription.plan.limit_of_employees,
                        limitOfProducts: updatedSubscription.plan.limit_of_products,
                        feePercentPerTransaction:
                            updatedSubscription.plan.fee_percent_per_transaction,
                    },
                    domain: updatedSubscription.tenant.domain,
                    nextBilling: updatedSubscription.next_billing.toISOString(),
                    createdAt: updatedSubscription.createdAt.toISOString(),
                    updatedAt: updatedSubscription.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            throw error;
        }
    }
}
