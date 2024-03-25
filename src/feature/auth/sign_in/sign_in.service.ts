import {Injectable, Inject, Request} from '@nestjs/common';
import {signInDto} from './dto/sign_in.dto';
import {User} from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import {Model} from 'mongoose';
import {isHash, validateOrReject, ValidationError} from 'class-validator';
import
{
    UserNotFoundException,
    InvalidPasswordException,
    ValidationFailedException,
    UnActivatedUserException,
    BadRequestException,
} from '../../../common/exceptions/exceptions';
import Logger, {LoggerKey} from 'src/core/logger/interfaces/logger.interface';
import {TokenService} from '../token/token.service';

@Injectable()
export class SignInService
{
    constructor (
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private readonly tokenService: TokenService,
    ) { }

    async signIn (_signInDto: signInDto): Promise<any>
    {
        try
        {
            // Validate sign in data
            const signInData = Object.assign(new signInDto(), _signInDto);
            await validateOrReject(signInData);

            // Check if user exists
        } catch (errors)
        {
            if (errors instanceof Array && errors[0] instanceof ValidationError)
            {
                const messages = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new ValidationFailedException(`Validation failed: ${ messages }`);
            } else
            {
                throw new ValidationFailedException('Validation failed', errors.toString());
            }
        }

        const user = await this.User.findOne({email: _signInDto.email}).select('+password');

        if (!user)
        {
            this.logger.error('User not found for email: ' + _signInDto.email);
            throw new UserNotFoundException('User not found for email: ' + _signInDto.email);
        }
        if (user.is_active === false) {
            this.logger.error('User is not active: ' + _signInDto.email);
            throw new UnActivatedUserException('User is not active: ' + _signInDto.email);
        }

        const isPasswordMatch = await argon.verify(user.password, _signInDto.password);

        // Ch
        if (!isPasswordMatch) {
            this.logger.error('Invalid password for user: ' + user.email);
            throw new InvalidPasswordException('Invalid password for user: ' + user.email);
        }

        const tokens = await this.tokenService.getTokens(user.user_id, _signInDto.device);
        const update_tokens = await this.tokenService.updateRefreshToken(user.user_id, tokens.refreshToken, true);

        return { user, tokens };
    }

    async signOut (@Request() req)
    {
        try
        {
            const userId = req.user['user_id'];
            const update_token = await this.tokenService.updateRefreshToken(userId, null, false);
            return {
                message: 'User successfully signed out',
                token: update_token,
            };
        } catch (error)
        {
            this.logger.error('Error while signing out', {error});
            throw new BadRequestException('Error while signing out', error.toString());
        }
    }
}
