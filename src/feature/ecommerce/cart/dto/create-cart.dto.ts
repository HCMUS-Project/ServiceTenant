import {
    IsString,
    IsUUID,
    IsDecimal,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
} from 'class-validator';

export class CreateCartDto {
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
}
