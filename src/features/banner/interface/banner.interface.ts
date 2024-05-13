import { CreateBannerRequest, DeleteBannerRequest, FindBannerByIdRequest, Banner, BannerResponse, UpdateBannerRequest } from "src/proto_build/tenant/banner_pb";



export interface IBanner extends Banner.AsObject {}

export interface IBannerResponse extends BannerResponse.AsObject {}

export interface ICreateBannerRequest extends CreateBannerRequest.AsObject {}
export interface ICreateBannerResponse extends BannerResponse.AsObject {}

export interface IFindBannerByIdRequest extends FindBannerByIdRequest.AsObject {}
export interface IFindBannerByIdResponse extends BannerResponse.AsObject {}

export interface IUpdateBannerRequest extends UpdateBannerRequest.AsObject {}
export interface IUpdateBannerResponse extends BannerResponse.AsObject {}

export interface IDeleteBannerRequest extends DeleteBannerRequest.AsObject {}
export interface IDeleteBannerResponse extends BannerResponse.AsObject {}
