import { configService } from '@/config/config.service';
import { MemberEntity } from '@/model/member.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JWTPayload {
  username: MemberEntity['username'];
  name: MemberEntity['name'];
  sub: MemberEntity['id'];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: JWTPayload) {
    return {
      username: payload.username,
      name: payload.name,
      id: payload.sub,
    };
  }
}
