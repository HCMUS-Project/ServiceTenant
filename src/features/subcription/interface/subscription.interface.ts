import {
    CancelSubscriptionRequest,
    CreateSubscriptionRequest,
    FindAllSubscriptionByQueryAdminRequest,
    FindAllSubscriptionByQueryRequest,
    FindAllSubscriptionResponse, 
    FindPlansRequest, 
    FindPlansResponse, 
    Plan,
    Subscription,
    SubscriptionResponse, 
    UpdateSubscriptionStageByAdminRequest,
} from 'src/proto_build/tenant/subscription_pb';

export interface ISubscription extends Subscription.AsObject {}
export interface IPlan extends Plan.AsObject {}

export interface ISubscriptionResponse extends SubscriptionResponse.AsObject {}

export interface ICreateSubscriptionRequest extends CreateSubscriptionRequest.AsObject {}
export interface ICreateSubscriptionResponse extends SubscriptionResponse.AsObject {}

export interface IFindAllSubscriptionByQueryRequest
    extends FindAllSubscriptionByQueryRequest.AsObject {}
export interface IFindAllSubscriptionResponse
    extends Omit<FindAllSubscriptionResponse.AsObject, 'subscriptionsList'> {
    subscriptions: ISubscription[];
}

export interface IFindAllSubscriptionByQueryAdminRequest
    extends FindAllSubscriptionByQueryAdminRequest.AsObject {}
export interface IFindAllSubscriptionResponse
    extends Omit<FindAllSubscriptionResponse.AsObject, 'subscriptionsList'> {
    subscriptions: ISubscription[];
}

export interface IFindPlansRequest extends FindPlansRequest.AsObject {}
export interface IFindPlansResponse extends Omit<FindPlansResponse.AsObject, 'plansList'> {
    plans: IPlan[];
}
export interface IUpdateSubscriptionStageByAdminRequest
    extends UpdateSubscriptionStageByAdminRequest.AsObject {}
export interface IUpdateSubscriptionStageByAdminResponse extends SubscriptionResponse.AsObject {}

export interface ICancelSubscriptionRequest extends CancelSubscriptionRequest.AsObject {}
export interface ICancelSubscriptionResponse extends SubscriptionResponse.AsObject {}
