import { IsString, IsNotEmpty, IsUUID, IsNumber, IsInt, IsOptional } from 'class-validator';

export class ProductDto {
    @IsUUID()
    id: string;

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

    @IsInt()
    views: number;

    @IsNumber()
    rating: number;

    @IsString()
    category_id: string;
}
