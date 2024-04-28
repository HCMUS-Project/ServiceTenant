import { IsOptional, IsDecimal, IsString, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class CartProductDto {
    @IsUUID()
    product_id: string;

    @IsDecimal()
    quantity: number; // Giả sử quantity có thể là số thập phân nếu bạn cho phép sản phẩm có số lượng không nguyên
}

export class UpdateCartDto {
    @IsDecimal()
    @IsOptional()
    total_price?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @TransformType(() => CartProductDto)
    products?: CartProductDto[];
}
