import {Controller, Get, UseGuards, Request} from '@nestjs/common';
import {TokenService} from './token.service';
import {RefreshTokenGuard} from 'src/common/guards/token/refreshToken.guard';
import {AccessTokenGuard} from 'src/common/guards/token/accessToken.guard';

@Controller('api/token')
export class TokenController
{
    constructor (private tokenService: TokenService) { }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refresh(@Request() req)
    {
        return this.tokenService.refresh(req);
    }
}
