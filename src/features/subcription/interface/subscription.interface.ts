import { CreateSubscriptionRequest, DeleteSubscriptionRequest, FindSubscriptionByTenantIdRequest, Subscription, SubscriptionResponse, UpdateSubscriptionRequest } from "src/proto_build/tenant/subscription_pb";



export interface ISubscription extends Subscription.AsObject {}

export interface ISubscriptionResponse extends SubscriptionResponse.AsObject {}

export interface ICreateSubscriptionRequest extends CreateSubscriptionRequest.AsObject {}
export interface ICreateSubscriptionResponse extends SubscriptionResponse.AsObject {}

export interface IFindSubscriptionByTenantIdRequest extends FindSubscriptionByTenantIdRequest.AsObject {}
export interface IFindSubscriptionByIdResponse extends SubscriptionResponse.AsObject {}

export interface IUpdateSubscriptionRequest extends UpdateSubscriptionRequest.AsObject {}
export interface IUpdateSubscriptionResponse extends SubscriptionResponse.AsObject {}

export interface IDeleteSubscriptionRequest extends DeleteSubscriptionRequest.AsObject {}
export interface IDeleteSubscriptionResponse extends SubscriptionResponse.AsObject {}
