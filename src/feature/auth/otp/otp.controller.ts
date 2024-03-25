import {Body, Controller, Post} from "@nestjs/common";
import { OtpService } from "./otp.service";
import { otpDto } from "./dto/otp.dto";

@Controller('/api/auth')
export class OtpController {
    constructor(private readonly otpService: OtpService) {
    }

    @Post('send-otp')
    async sendOtpEmail(@Body() otpDto: otpDto): Promise<void> {
        return await this.otpService.sendOtpEmail(otpDto);
    }

    @Post('check-otp')
    async checkOtp(@Body() otpDto: otpDto): Promise<boolean> {
        return await this.otpService.activeAccount(otpDto);
    }
}