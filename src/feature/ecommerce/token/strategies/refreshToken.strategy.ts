import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Request} from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor ()
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    validate (req: Request, payload: any)
    {
        const authHeader = req.headers.authorization;
        if (!authHeader)
        {
            throw new UnauthorizedException('Authorization header is missing');
        }
        if (!authHeader.startsWith('Bearer '))
        {
            throw new UnauthorizedException('Invalid Authorization header format');
        }
        const refreshToken = authHeader.replace('Bearer ', '').trim();
        return {...payload, refreshToken};
    }
}
