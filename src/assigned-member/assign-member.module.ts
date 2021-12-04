import { Module } from '@nestjs/common';
import { AssignMemberService } from './assign-member.service';

@Module({ providers: [AssignMemberService] })
export class AssignMemberModule {}
