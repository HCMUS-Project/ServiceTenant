import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { OtpController } from "./otp.controller";
import { OtpService } from "./otp.service";
import {otpProvider} from "./otp.provider";
import {DatabaseModule} from "../../../core/database/modules/database.module";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'vannghia943@gmail.com',
                    pass: 'yzrc gaii itak ayqm',
                },
            },
            defaults: {
                from: '"No Reply" <no-reply@gmail.com>',
            },
        }),
        DatabaseModule,
    ],
    controllers: [OtpController],
    providers: [OtpService, ...otpProvider],
})
export class OtpModule {}
