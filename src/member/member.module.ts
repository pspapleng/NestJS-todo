import { MemberEntity } from '@/model/member.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './member.service';

@Module({
  imports: [],
  providers: [MemberService],
})
export class MemberModule {}
