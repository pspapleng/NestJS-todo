import { configService } from '../config/config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export interface JWTPayload {
    username: string;
    sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromHeader("x-member-token"),
            ignoreExpiration: false,
            secretOrKey: configService.getSecret(),
        });
    }

    async validate(payload: JWTPayload) {
        return { userId: payload.sub, username: payload.username };
    }
}