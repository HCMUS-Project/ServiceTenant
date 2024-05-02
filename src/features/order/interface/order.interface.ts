import { CreateOrderRequest, CreateOrderResponse } from 'src/proto_build/e_commerce/order_pb';

export interface ICreateOrderRequest
    extends Omit<CreateOrderRequest.AsObject, 'productsIdList' | 'quantitiesList'> {
    productsId: string[];
    quantities: number[];
}
export interface ICreateOrderResponse extends CreateOrderResponse.AsObject {}
