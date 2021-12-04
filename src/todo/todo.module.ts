import { AssignMemberService } from './../assigned-member/assign-member.service';
import { MemberService } from '@/member/member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoEntity } from '@/model/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodoService, MemberService, AssignMemberService],
  controllers: [TodoController],
})
export class TodoModule {}
