import { CreatePolicyAndTermRequest, DeletePolicyAndTermRequest, FindPolicyAndTermByTenantIdRequest, PolicyAndTerm, PolicyAndTermResponse, UpdatePolicyAndTermRequest } from "src/proto_build/tenant/policyandterm_pb";



export interface IPolicyAndTerm extends PolicyAndTerm.AsObject {}

export interface IPolicyAndTermResponse extends PolicyAndTermResponse.AsObject {}

export interface ICreatePolicyAndTermRequest extends CreatePolicyAndTermRequest.AsObject {}
export interface ICreatePolicyAndTermResponse extends PolicyAndTermResponse.AsObject {}

export interface IFindPolicyAndTermByTenantIdRequest extends FindPolicyAndTermByTenantIdRequest.AsObject {}
export interface IFindPolicyAndTermByIdResponse extends PolicyAndTermResponse.AsObject {}

export interface IUpdatePolicyAndTermRequest extends UpdatePolicyAndTermRequest.AsObject {}
export interface IUpdatePolicyAndTermResponse extends PolicyAndTermResponse.AsObject {}

export interface IDeletePolicyAndTermRequest extends DeletePolicyAndTermRequest.AsObject {}
export interface IDeletePolicyAndTermResponse extends PolicyAndTermResponse.AsObject {}
