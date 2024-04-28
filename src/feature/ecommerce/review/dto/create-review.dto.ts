import { ProductDto } from '../../product/dto/product.dto';
import { IsString, IsNotEmpty, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNumber({}, { message: 'Rating must be a number' })
    @Min(1, { message: 'Rating must be at least 1' })
    @Max(5, { message: 'Rating must not exceed 5' })
    rating: number;

    @IsString()
    @IsNotEmpty()
    review: string;

    @ValidateNested()
    @Type(() => ProductDto)
    product: ProductDto;
}
