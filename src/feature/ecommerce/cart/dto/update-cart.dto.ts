import { IsOptional, IsDecimal, IsString, IsUUID, ValidateNested, IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class UpdateCartDto {
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
