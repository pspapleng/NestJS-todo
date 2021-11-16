import { configService } from '../config/config.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from '../model/members.entity';
import { MembersService } from '../members/members.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Members]), PassportModule, JwtModule.register({
    secret: configService.getSecret(),
    signOptions: { expiresIn: '7d' },
  }),],
  providers: [AuthService, LocalStrategy, JwtStrategy, MembersService],
  controllers: [AuthController]
})
export class AuthModule { }
