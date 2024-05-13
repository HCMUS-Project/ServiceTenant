import { CreateThemeConfigRequest, DeleteThemeConfigRequest, FindThemeConfigByTenantIdRequest, ThemeConfig, ThemeConfigResponse, UpdateThemeConfigRequest } from "src/proto_build/tenant/themeconfig_pb";

export interface IThemeConfig extends ThemeConfig.AsObject {}

export interface IThemeConfigResponse extends ThemeConfigResponse.AsObject {}

export interface ICreateThemeConfigRequest extends CreateThemeConfigRequest.AsObject {}
export interface ICreateThemeConfigResponse extends ThemeConfigResponse.AsObject {}

export interface IFindThemeConfigByTenantIdRequest extends FindThemeConfigByTenantIdRequest.AsObject {}
export interface IFindThemeConfigByIdResponse extends ThemeConfigResponse.AsObject {}

export interface IUpdateThemeConfigRequest extends UpdateThemeConfigRequest.AsObject {}
export interface IUpdateThemeConfigResponse extends ThemeConfigResponse.AsObject {}

export interface IDeleteThemeConfigRequest extends DeleteThemeConfigRequest.AsObject {}
export interface IDeleteThemeConfigResponse extends ThemeConfigResponse.AsObject {}
