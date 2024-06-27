import {
    Customer,
    GetAllBookingsOrdersNumbersRequest,
    GetAllBookingsOrdersNumbersResponse,
} from 'src/proto_build/tenant/customers_pb';

export interface ICustomer extends Customer.AsObject {}

export interface IGetAllBookingsOrdersNumbersRequest
    extends GetAllBookingsOrdersNumbersRequest.AsObject {}

export interface IGetAllBookingsOrdersNumbersResponse
    extends Omit<GetAllBookingsOrdersNumbersResponse.AsObject, 'customersList'> {
    customers: ICustomer[];
}
