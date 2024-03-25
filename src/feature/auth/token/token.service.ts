import {Inject, Injectable, Request} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Model} from 'mongoose';
import {Token} from 'src/models/user/interfaces/token.interface';
import Logger, {LoggerKey} from 'src/core/logger/interfaces/logger.interface';
import {BadRequestException, ForbiddenException, InvalidPasswordException, UserNotFoundException, ValidationFailedException} from 'src/common/exceptions/exceptions';
import * as argon from 'argon2';
import {addMinutes, addHours} from 'date-fns';

@Injectable()
export class TokenService
{
    constructor (
        @Inject('TOKEN_MODEL') private readonly Token: Model<Token>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(LoggerKey) private logger: Logger,
    ) { }

    async saveToken (
        accessToken: string,
        refreshToken: string,
        userId: string,
        deviceId: string,
        access_token_expired_at: Date,
        refresh_token_expired_at: Date,
    )
    {
        try
        {
            const newToken = new this.Token({
                access_token: accessToken,
                refresh_token: refreshToken,
                user_id: userId,
                device_id: deviceId,
                access_token_expired_at: access_token_expired_at,
                refresh_token_expired_at: refresh_token_expired_at,
            });
            return await newToken.save();
        } catch (error)
        {
            this.logger.error('Error while saving token', {error});
            throw new BadRequestException('Error while saving token', error.toString());
        }
    }

    async refreshTokens (userId: string, refreshToken: string)
    {
        const token = await this.Token.findOne({user_id: userId});

        if (!token || !token.refresh_token)
            throw new UserNotFoundException('Refresh token not found');
        const refreshTokenMatches = await argon.verify(token.refresh_token, refreshToken);
        if (!refreshTokenMatches)
            throw new InvalidPasswordException('Refresh token does not match');
        const tokens = await this.getTokens(token.user_id.toString(), token.device_id);
        await this.updateRefreshToken(token.user_id.toString(), tokens.refreshToken, true);
        return tokens;
    } catch (error)
    {
        if (error instanceof UserNotFoundException || error instanceof InvalidPasswordException)
        {
            this.logger.error('Error while refreshing tokens', {error});
            throw error;
        }
        throw new ValidationFailedException('Error while refreshing tokens', error.toString());
    }

    hashData (data: string)
    {
        try
        {
            return argon.hash(data);
        } catch (error)
        {
            this.logger.error('Error while hashing data', {error});
            throw new BadRequestException('Error while hashing data', error.toString());
        }
    }

    async updateRefreshToken (userId: string, refreshToken: string, isHashed = false)
    {
        try
        {
            let value;
            if (isHashed == false || refreshToken === null)
            {
                value = refreshToken;
            } else
            {
                value = await this.hashData(refreshToken);
            }
            return await this.Token.findOneAndUpdate(
                {user_id: userId},
                {refresh_token: value},
                {new: true},
            ).exec();
        } catch (error)
        {
            this.logger.error('Error while updating refresh token', {error});
            throw new BadRequestException('Error while updating refresh token', error.toString());
        }
    }

    async getTokens (user_id: string, device_id: string)
    {
        try
        {
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(
                    {
                        user_id,
                        device_id,
                    },
                    {
                        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                        expiresIn: '15m',
                    },
                ),
                this.jwtService.signAsync(
                    {
                        user_id,
                        device_id,
                    },
                    {
                        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                        expiresIn: '1d',
                    },
                ),
            ]);

            // Calculate expiration times
            const accessTokenExpiresAt = addMinutes(new Date(), 15);
            const refreshTokenExpiresAt = addHours(new Date(), 24);
            // const refreshTokenExpiresAt = addMinutes(new Date(), 15);

            await this.Token.findOneAndUpdate(
                {user_id: user_id, device_id: device_id},
                {
                    access_token: accessToken, access_token_expired_at: accessTokenExpiresAt
                    , refresh_token_expired_at: refreshTokenExpiresAt
                },
                {new: true},
            ).exec();

            return {
                accessToken,
                refreshToken,
                accessTokenExpiresAt,
                refreshTokenExpiresAt,
            };
        } catch (error)
        {
            this.logger.error('Error while getting tokens', {error});
            throw new BadRequestException('Error while getting tokens', error.toString());
        }
    }

    async refresh (@Request() req)
    {
        try
        {
            const userId = req.user['user_id'];
            const refreshToken = req.user['refreshToken'];
            return this.refreshTokens(userId, refreshToken);
        } catch (error)
        {
            this.logger.error('Error while refresh token', {error});
            throw new BadRequestException('Error while refresh token', error.toString());
        }
    }
}
