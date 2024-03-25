import {Inject, Injectable} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { otpDto } from "./dto/otp.dto";
import * as generatePassword from 'generate-password';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore } from '@nestjs/cache-manager';
import {Model} from "mongoose";
import { User } from 'src/models/user/interfaces/user.interface';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import {
    UserNotFoundException,
} from '../../../common/exceptions/exceptions';


@Injectable()
export class OtpService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
    ) {
    }

    async sendOtpEmail(otpDto: otpDto): Promise<void> {
        try {
            if (!otpDto.email) {
                throw new Error('Email is not provided.');
            }
            const generate_otp = generatePassword.generate({
                length: 6,
                numbers: true,
            });

            await this.cacheManager.set(`otp_${otpDto.email}`, `${generate_otp}`, {ttl: 300});

            const response = await this.mailerService.sendMail({
                to: otpDto.email,
                subject: 'Your OTP',
                text: `Your One Time Password (OTP): ${generate_otp}`,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async activeAccount(otpDto: otpDto): Promise<boolean> {
        const savedOtp = await this.cacheManager.get(`otp_${otpDto.email}`);
        const isOtpValid = savedOtp === otpDto.otp;
        let isAccountActive = false;
        if (isOtpValid) {
            const user = await this.User.findOne({email: otpDto.email}).select('+password');
            if (!user) {
                this.logger.error('User not found for email: ' + otpDto.email);
                throw new UserNotFoundException('User not found for email: ' + otpDto.email);
            } else {
                const result = await this.User.updateOne({email: otpDto.email}, {is_active: true});
                isAccountActive = result.acknowledged;
            }
            await this.cacheManager.del(`otp_${otpDto.email}`);
        }
        return isAccountActive;
    }

    async recoverPassword(otpDto: otpDto, new_password: string): Promise<boolean> {
        const savedOtp = await this.cacheManager.get(`otp_${otpDto.email}`);
        const isOtpValid = savedOtp === otpDto.otp;
        let isPasswordChange = false;
        if (isOtpValid) {
            const user = await this.User.findOne({email: otpDto.email}).select('+password');
            if (!user) {
                this.logger.error('User not found for email: ' + otpDto.email);
                throw new UserNotFoundException('User not found for email: ' + otpDto.email);
            } else {
                const result = await this.User.updateOne({email: otpDto.email}, {password: new_password});
                isPasswordChange = result.acknowledged;
            }
            await this.cacheManager.del(`otp_${otpDto.email}`);
        }
        return isPasswordChange;
    }
}