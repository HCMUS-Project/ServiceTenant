import { CreateTenantRequest, DeleteTenantRequest, FindTenantByDomainRequest, FindTenantByIdRequest, Tenant, TenantResponse, UpdateTenantRequest } from "src/proto_build/tenant/tenant_pb";



export interface ITenant extends Tenant.AsObject {}

export interface ITenantResponse extends TenantResponse.AsObject {}

export interface ICreateTenantRequest extends CreateTenantRequest.AsObject {}
export interface ICreateTenantResponse extends TenantResponse.AsObject {}

export interface IFindTenantByIdRequest extends FindTenantByIdRequest.AsObject {}
export interface IFindTenantByIdResponse extends TenantResponse.AsObject {}

export interface IFindTenantByDomainRequest extends FindTenantByDomainRequest.AsObject {}
export interface IFindTenantByDomainResponse extends TenantResponse.AsObject {}

export interface IUpdateTenantRequest extends UpdateTenantRequest.AsObject {}
export interface IUpdateTenantResponse extends TenantResponse.AsObject {}

export interface IDeleteTenantRequest extends DeleteTenantRequest.AsObject {}
export interface IDeleteTenantResponse extends TenantResponse.AsObject {}
