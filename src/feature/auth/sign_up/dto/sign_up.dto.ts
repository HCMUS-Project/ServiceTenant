import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class signUpDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly device: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
