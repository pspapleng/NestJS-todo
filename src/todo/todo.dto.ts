import { TodoEntity } from '@/model/todo.entity';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class CreateTodoDto extends PickType(TodoEntity, [
  'title',
  'description',
  'due_date',
] as const) {}

// PartialType ทำให้ client ไม่ต้องส่งบาง column มาได้
export class UpdateTodoDto extends PartialType(
  PickType(TodoEntity, ['title', 'description', 'status'] as const),
) {}
