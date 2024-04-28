import {
    IsString,
    IsUUID,
    IsInt,
    ValidateNested,
    IsDecimal,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from '../../product/dto/product.dto';

export class CreateCartDto {
    @IsUUID()
    user_id: string;

    @IsString()
    domain: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];

    @IsDecimal()
    total_price: number;
}
