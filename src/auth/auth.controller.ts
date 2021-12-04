import { ThrottlerBehindProxyGuard } from './../throttler-behind-proxy.guard';
import { JWTPayload } from './jwt.strategy';
import { JwtAuthGuard } from './../jwt-auth.guard';
import { AuthService } from './auth.service';
import { User } from './../user.decorator';
import { CreateMemberDto } from './../member/member.dto';
import { MemberService } from './../member/member.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '@/local-auth.guard';
import { MemberEntity } from '@/model/member.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private memberService: MemberService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerBehindProxyGuard)
  public async register(@Body() dto: CreateMemberDto) {
    return await this.memberService.create(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@User() member: MemberEntity) {
    return this.authService.login(member);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  public async profile(@User() jwtPayload: JWTPayload) {
    return jwtPayload;
  }
}
