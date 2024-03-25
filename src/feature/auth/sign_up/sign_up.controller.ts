import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignUpService } from './sign_up.service';
import { signUpDto } from './dto/sign_up.dto';

@Controller('api/auth')
export class SignUpController {
    constructor(private signUpService: SignUpService) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: signUpDto) {
        return this.signUpService.signUp(signUpDto);
    }
}
