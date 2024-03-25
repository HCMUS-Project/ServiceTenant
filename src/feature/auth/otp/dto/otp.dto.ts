import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class otpDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}
