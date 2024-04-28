import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsNumber,
    IsInt,
    IsOptional,
    IsArray,
    ArrayMinSize,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number;

    @IsInt()
    quantity: number;

    @IsString()
    @IsOptional()
    tenant_id?: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    image: string[];

    @IsInt()
    views: number;

    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    category_id: string[];
}
