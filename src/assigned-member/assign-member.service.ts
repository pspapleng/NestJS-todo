import { TodoService } from './../todo/todo.service';
import { TodoEntity } from '@/model/todo.entity';
import { AssignedMemberEntity } from './../model/assignedMembers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssignMemberDto } from './assign-member.dto';

export class AssignMemberService {
  constructor(
    private todoService: TodoService,

    @InjectRepository(AssignedMemberEntity)
    private assignMemberRepository: Repository<AssignedMemberEntity>,
  ) {}

  public async getAll() {
    return await this.assignMemberRepository.find({ relations: ['todo'] });
  }

  public async createMany(
    todoId: TodoEntity['id'],
    members: CreateAssignMemberDto,
  ) {
    let todo = await this.todoService.findById(todoId);
    const assignMemberList = todo.assigned_members.map((e) => e.member.id);
    const newMember = members.members.filter((mId) => {
      return !assignMemberList.includes(mId);
    });

    const insertResult = await Promise.all(
      newMember.map((memberId) => {
        const newAssignMember = {
          todo: {
            id: todoId,
          },
          member: {
            id: memberId,
          },
        };
        return this.assignMemberRepository.save(newAssignMember);
      }),
    );
    return insertResult.map((e) => e.id);
  }

  public async remove(
    todoId: TodoEntity['id'],
    members: CreateAssignMemberDto,
  ) {
    const insertResult = await Promise.all(
      members.members.map((memberId) => {
        return this.assignMemberRepository.delete({
          todo: { id: todoId },
          member: { id: memberId },
        });
      }),
    );
    return insertResult;
  }
}
