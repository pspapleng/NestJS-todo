import { TodoEntity, TODO_STATUS } from './../model/todo.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationSchedule {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  private readonly logger = new Logger(NotificationSchedule.name);

  //   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Called when the current midnight');
    return this.todoRepository
      .find({
        where: {
          status: TODO_STATUS.IN_PROGRESS,
          due_date: LessThanOrEqual(new Date()),
        },
        relations: ['assigned_members', 'assigned_members.member'],
      })
      .then((todos) => {
        todos.forEach((todo) => {
          todo.assigned_members.forEach((member) => {
            this.notificationQueue.add({
              ...todo,
              assigned_members: member,
            });
          });
        });
      });
  }
}
