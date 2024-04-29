import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsString, IsNotEmpty, IsDecimal, IsDate, Min, Max, IsOptional, IsNumber } from 'class-validator';

export class UpdateVoucherDto {
    @IsString()
    domain: string;

    @IsOptional()
    @IsString()
    voucher_name?: string;

    @IsOptional()
    @IsString()
    voucher_code?: string;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Max discount must be greater than or equal to 0' })
    max_discount?: number;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Min app value must be greater than or equal to 0' })
    min_app_value?: number;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Discount percent must be greater than or equal to 0' })
    @Max(100, { message: 'Discount percent must not exceed 100' })
    discount_percent?: number;

    @IsOptional()
    @IsString()
    expire_at?: string;
}