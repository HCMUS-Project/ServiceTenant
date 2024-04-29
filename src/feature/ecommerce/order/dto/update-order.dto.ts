import {IsString, IsUUID, IsArray, IsNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';

export class UpdateOrderDto {
    @IsString()
    @IsOptional()
    stage: string;
}
