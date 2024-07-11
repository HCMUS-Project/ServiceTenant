import {
    Customer,
    GetAllBookingsOrdersNumbersRequest,
    GetAllBookingsOrdersNumbersResponse,
    GetUsersReportByDateRequest,
    GetUsersReportByDateResponse,
    UserReportByDate, 
} from 'src/proto_build/tenant/customers_pb';

export interface ICustomer extends Customer.AsObject {}

export interface IGetAllBookingsOrdersNumbersRequest
    extends GetAllBookingsOrdersNumbersRequest.AsObject {}

export interface IGetAllBookingsOrdersNumbersResponse
    extends Omit<GetAllBookingsOrdersNumbersResponse.AsObject, 'customersList'> {
    customers: ICustomer[];
}

export interface IUserReportByDate extends UserReportByDate.AsObject {}

export interface IGetUsersReportByDateRequest extends GetUsersReportByDateRequest.AsObject {}

export interface IGetUsersReportByDateResponse
    extends Omit<GetUsersReportByDateResponse.AsObject, 'reportsList'> {
    reports: IUserReportByDate[];
}
