import { Injectable } from '@nestjs/common';
import { configService } from '../config/config.service';
import { AES, enc } from 'crypto-js';
import { MembersDTO } from '../members/members.dto';
import { MembersService } from '../members/members.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private membersService: MembersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const member = await this.membersService.getByUsername(username)
        if (member && AES.decrypt(member.password, configService.getSecret()).toString(enc.Utf8) === password) {
            return MembersDTO.fromEntity(member);
        }
        return null;
    }

    async login(member: any) {
        const payload = { username: member.username, sub: member.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
