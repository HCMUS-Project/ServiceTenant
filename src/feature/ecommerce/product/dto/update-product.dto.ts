import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, IsInt, IsOptional, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  tenant_id?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsArray()
  @ArrayMinSize(1)
  image: string[];
  
  @IsInt()
  @IsOptional()
  views?: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  category_id: string[];
}
