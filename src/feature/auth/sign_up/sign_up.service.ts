import {Inject, Injectable, BadRequestException} from '@nestjs/common';
import {signUpDto} from './dto/sign_up.dto';
import * as argon from 'argon2';
import {Model} from 'mongoose';
import {User} from 'src/models/user/interfaces/user.interface';
import {validateOrReject, ValidationError} from 'class-validator';
import Logger, {LoggerKey} from 'src/core/logger/interfaces/logger.interface';
import {ForbiddenException} from 'src/common/exceptions/exceptions';
import {TokenService} from '../token/token.service';
import {UsersService} from '../users/users.service';

@Injectable()
export class SignUpService
{
    constructor (
        @Inject('SIGN_UP_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private readonly tokenService: TokenService,
    ) { }

    async signUp (_signUpDto: signUpDto): Promise<any>
    {
        try
        {
            const signUpData = Object.assign(new signUpDto(), _signUpDto);
            await validateOrReject(signUpData);
        } catch (errors)
        {
            if (errors instanceof Array && errors[0] instanceof ValidationError)
            {
                const messages = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new BadRequestException(`Validation failed: ${ messages }`);
            }
        }

        try
        {
            const hashedPassword = await argon.hash(_signUpDto.password);

            // Check if user already exists
            const checkuser = await this.User.findOne({ email: _signUpDto.email });
            if (checkuser) {
                if (checkuser.is_active === true) {
                    this.logger.error("User already exists. Can't sign up!");
                    throw new ForbiddenException(
                        "User already exists. Can't sign up!",
                        'User already exists',
                    );
                }

                else {
                    this.logger.error("User already exists. Can't sign up!");
                    throw new ForbiddenException(
                        "User already exists but not active. Activating user with OTP",
                        'User already exists',
                    );
                }
            }

            // Save user to database
            const newUser = new this.User({
                email: _signUpDto.email,
                device: _signUpDto.device,
                password: hashedPassword,
            });

            const user = await newUser.save();

            // Generate, save and update hashed refresh_token
            const tokens = await this.tokenService.getTokens(user.user_id, _signUpDto.device);

            const save_token = await this.tokenService.saveToken(
                tokens.accessToken,
                tokens.refreshToken,
                user.user_id,
                _signUpDto.device,
                tokens.accessTokenExpiresAt,
                tokens.refreshTokenExpiresAt,
            );

            const new_tokens = await this.tokenService.updateRefreshToken(
                user.user_id,
                tokens.refreshToken,
                true
            );

            return {user, new_tokens};
        } catch (error)
        {
            this.logger.error('Error while signing up user', {error});
            return error;
        }
    }
}
