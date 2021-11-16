import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from '../model/members.entity';
import { MembersService } from '../members/members.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Members]), PassportModule],
  providers: [AuthService, LocalStrategy, MembersService],
  controllers: [AuthController]
})
export class AuthModule { }
