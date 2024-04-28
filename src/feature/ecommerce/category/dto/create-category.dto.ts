// category.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;
}
