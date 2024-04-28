import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsOptional()
    review: string;
    
    @IsOptional()
    @IsNumber({}, { message: 'Rating must be a number' })
    @Min(1, { message: 'Rating must be at least 1' })
    @Max(5, { message: 'Rating must not exceed 5' })
    rating: number;
}
