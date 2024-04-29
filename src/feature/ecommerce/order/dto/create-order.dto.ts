import {
    IsString,
    IsUUID,
    IsDecimal,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    IsOptional,
} from 'class-validator';

export class CreateOrderDto {
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    products_id: string[];

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    quantities: number[];

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsUUID()
    @IsString()
    @IsOptional()
    voucher_id: string;
}
