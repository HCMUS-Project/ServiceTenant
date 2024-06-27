import { Observable } from 'rxjs';
import {BookingReportOfUser, GetBookingsReportOfListUsersRequest, GetBookingsReportOfListUsersResponse} from 'src/proto_build/users/booking_pb';


export interface BookingUsersService {
    getBookingsReportOfListUsers(
        data: IGetBookingsReportOfListUsersRequest,
    ): Observable<IGetBookingsReportOfListUsersResponse>;
}

export interface IBookingReportOfUser extends BookingReportOfUser.AsObject {}

export interface IGetBookingsReportOfListUsersRequest
    extends Omit<GetBookingsReportOfListUsersRequest.AsObject, 'emailsList'> {
    emails: string[];
}
export interface IGetBookingsReportOfListUsersResponse
    extends Omit<GetBookingsReportOfListUsersResponse.AsObject, 'reportBookingList'> {
    reportBooking: IBookingReportOfUser[];
}