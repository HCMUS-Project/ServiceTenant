import { Observable } from 'rxjs';
import {
    GetOrdersReportOfListUsersRequest,
    GetOrdersReportOfListUsersResponse,
    OrderReportOfUser,
} from 'src/proto_build/users/order_pb';

export interface OrderUsersService {
    getOrdersReportOfListUsers(
        data: IGetOrdersReportOfListUsersRequest,
    ): Observable<IGetOrdersReportOfListUsersResponse>;
}

export interface IOrderReportOfUser extends OrderReportOfUser.AsObject {}
export interface IGetOrdersReportOfListUsersRequest
    extends Omit<GetOrdersReportOfListUsersRequest.AsObject, 'emailsList'> {
    emails: string[];
}
export interface IGetOrdersReportOfListUsersResponse
    extends Omit<GetOrdersReportOfListUsersResponse.AsObject, 'reportOrdersList'> {
    reportOrders: IOrderReportOfUser[];
}
