import { CreateTodoDto } from './todo.dto';
import { MemberEntity } from '@/model/member.entity';
import { MemberService } from '@/member/member.service';
import { TodoEntity } from '@/model/todo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private memberService: MemberService,
  ) {}

  public async create(
    memberId: MemberEntity['id'],
    dto: CreateTodoDto,
  ): Promise<TodoEntity['id']> {
    const member = await this.memberService.findById(memberId);
    const newTodo: Partial<TodoEntity> = {
      ...dto,
      member,
    };

    const insertResult = await this.todoRepository.save(newTodo);
    return insertResult.id;
  }

  public async getAll(): Promise<TodoEntity[]> {
    return await this.todoRepository.find({
      //   where: {
      //     due_date: MoreThanOrEqual(new Date()),
      //   },
      relations: ['member'],
    });
  }
}
