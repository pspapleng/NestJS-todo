import { TODO_STATUS } from './../model/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';
import { MemberEntity } from '@/model/member.entity';
import { MemberService } from '@/member/member.service';
import { TodoEntity } from '@/model/todo.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private memberService: MemberService,

    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  // validate todo owner
  private async validateOwner(
    memberId: MemberEntity['id'],
    todoId: TodoEntity['id'],
  ): Promise<boolean> {
    const isExists = await this.todoRepository.findOne({
      where: { id: todoId, member: { id: memberId } },
    });
    if (isExists) return true;
    return false;
  }

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

  public async update(
    memberId: MemberEntity['id'],
    todoId: TodoEntity['id'],
    dto: UpdateTodoDto,
  ) {
    const isOwner = await this.validateOwner(memberId, todoId);
    if (!isOwner) throw new ForbiddenException();
    await this.todoRepository.update(todoId, dto);
    return Promise.resolve();
  }

  public async delete(
    memberId: MemberEntity['id'],
    todoId: MemberEntity['id'],
  ) {
    const isOwner = await this.validateOwner(memberId, todoId);
    if (!isOwner) throw new ForbiddenException();
    const todo = await this.todoRepository.findOne(todoId, {
      relations: ['member', 'assigned_members', 'assigned_members.member'],
    });
    if (todo.status === TODO_STATUS.IN_PROGRESS) {
      todo.assigned_members.forEach((member) => {
        this.notificationQueue.add({
          ...todo,
          assigned_members: member,
        });
      });
    }
    await this.todoRepository.softDelete(todoId);
    return Promise.resolve();
  }

  public async getAll(): Promise<TodoEntity[]> {
    return await this.todoRepository.find({
      //   where: {
      //     due_date: MoreThanOrEqual(new Date()),
      //   },
      relations: ['member', 'assigned_members', 'assigned_members.member'],
    });
  }

  public async findById(id: TodoEntity['id']): Promise<TodoEntity> {
    return await this.todoRepository.findOne(id, {
      relations: ['assigned_members', 'assigned_members.member'],
    });
  }
}
