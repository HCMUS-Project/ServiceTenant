import {
    CreateOrderRequest,
    CreateOrderResponse,
    GetOrderRequest,
    GetOrderResponse,
    ListOrdersRequest,
    ListOrdersResponse,
    OrderProduct,
} from 'src/proto_build/e_commerce/order_pb';

export interface ICreateOrderRequest
    extends Omit<CreateOrderRequest.AsObject, 'productsIdList' | 'quantitiesList'> {
    productsId: string[];
    quantities: number[];
}
export interface ICreateOrderResponse extends CreateOrderResponse.AsObject {}

export interface IOrderProduct extends OrderProduct.AsObject {}
export interface IGetOrderRequest extends GetOrderRequest.AsObject {}
export interface IGetOrderResponse extends Omit<GetOrderResponse.AsObject, 'productsList'> {
    products: IOrderProduct[];
}

export interface IListOrdersRequest extends ListOrdersRequest.AsObject {}
export interface IListOrdersResponse extends Omit<ListOrdersResponse.AsObject, 'ordersList'> {
    orders: IGetOrderResponse[];
}
