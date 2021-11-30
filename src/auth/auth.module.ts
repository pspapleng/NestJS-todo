import { configService } from '@/config/config.service';
import { JwtStrategy } from './jwt.strategy';
import { MemberEntity } from './../model/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from '@/member/member.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity]),
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MemberService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
