import {
    CreateVNPayConfigRequest,
    DeleteVNPayConfigRequest,
    GetVNPayConfigByTenantIdRequest,
    UpdateVNPayConfigRequest,
    VNPayConfig,
    VNPayConfigResponse,
} from 'src/proto_build/tenant/vnpayconfig_pb';

export interface IVNPayConfig extends VNPayConfig.AsObject {}

export interface IVNPayConfigResponse extends VNPayConfigResponse.AsObject {}

export interface ICreateVNPayConfigRequest extends CreateVNPayConfigRequest.AsObject {}
export interface ICreateVNPayConfigResponse extends IVNPayConfigResponse {}

export interface IGetVNPayConfigByTenantIdRequest
    extends GetVNPayConfigByTenantIdRequest.AsObject {}
export interface IGetVNPayConfigByTenantIdResponse extends IVNPayConfigResponse {}

export interface IUpdateVNPayConfigRequest extends UpdateVNPayConfigRequest.AsObject {}
export interface IUpdateVNPayConfigResponse extends IVNPayConfigResponse {}

export interface IDeleteVNPayConfigRequest extends DeleteVNPayConfigRequest.AsObject {}
export interface IDeleteVNPayConfigResponse extends IVNPayConfigResponse {}
