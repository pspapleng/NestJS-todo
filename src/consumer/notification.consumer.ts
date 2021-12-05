import { Logger } from '@nestjs/common';
import { AssignedMemberEntity } from './../model/assignedMembers.entity';
import { TodoEntity } from './../model/todo.entity';
import { OmitType } from '@nestjs/mapped-types';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

export class JobDateTodoDto extends OmitType(TodoEntity, [
  'assigned_members',
] as const) {
  assigned_members: AssignedMemberEntity;
}

@Processor('notification')
export class NotificationConsumer {
  private logger = new Logger(NotificationConsumer.name);
  @Process()
  async transcode(job: Job<JobDateTodoDto>) {
    this.logger.log(
      `notify to ${job.data.assigned_members.member.username} :: ${job.data.title} is expired.`,
    );
    return {};
  }
}
