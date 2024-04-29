import { IsString, IsNotEmpty, IsDecimal, IsDate, Min, Max, IsOptional, IsNumber } from 'class-validator';

export class CreateVoucherDto {
    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    voucher_name: string;

    @IsString()
    @IsNotEmpty()
    voucher_code: string;

    @IsNumber()
    @Min(0, { message: 'Max discount must be greater than or equal to 0' })
    max_discount: number;

    @IsNumber()
    @Min(0, { message: 'Min app value must be greater than or equal to 0' })
    min_app_value: number;

    @IsNumber()
    @Min(0, { message: 'Discount percent must be greater than or equal to 0' })
    @Max(100, { message: 'Discount percent must not exceed 100' })
    discount_percent: number;

    @IsString()
    @IsOptional()
    expire_at?: string;
}