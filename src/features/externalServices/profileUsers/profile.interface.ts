import { Observable } from 'rxjs';
import {
    GetAllUserProfileRequest,
    GetAllUserProfileResponse,
    GetProfileResponse,
} from 'src/proto_build/users/profile_pb';

export interface ProfileUsersService {
    getAllUserProfile(data: IGetAllUserProfileRequest): Observable<IGetAllUserProfileResponse>;
}

export interface IGetProfileResponse extends GetProfileResponse.AsObject {}

export interface IGetAllUserProfileRequest extends GetAllUserProfileRequest.AsObject {}
export interface IGetAllUserProfileResponse
    extends Omit<GetAllUserProfileResponse.AsObject, 'usersList'> {
    users: IGetProfileResponse[];
}
