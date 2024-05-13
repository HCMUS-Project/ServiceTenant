import { CreateTenantProfileRequest, DeleteTenantProfileRequest, FindTenantProfileByTenantIdRequest, TenantProfile, TenantProfileResponse, UpdateTenantProfileRequest } from "src/proto_build/tenant/tenantprofile_pb";



export interface ITenantProfile extends TenantProfile.AsObject {}

export interface ITenantProfileResponse extends TenantProfileResponse.AsObject {}

export interface ICreateTenantProfileRequest extends CreateTenantProfileRequest.AsObject {}
export interface ICreateTenantProfileResponse extends TenantProfileResponse.AsObject {}

export interface IFindTenantProfileByTenantIdRequest extends FindTenantProfileByTenantIdRequest.AsObject {}
export interface IFindTenantProfileByIdResponse extends TenantProfileResponse.AsObject {}

export interface IUpdateTenantProfileRequest extends UpdateTenantProfileRequest.AsObject {}
export interface IUpdateTenantProfileResponse extends TenantProfileResponse.AsObject {}

export interface IDeleteTenantProfileRequest extends DeleteTenantProfileRequest.AsObject {}
export interface IDeleteTenantProfileResponse extends TenantProfileResponse.AsObject {}
