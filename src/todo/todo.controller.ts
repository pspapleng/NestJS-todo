import { CreateTodoDto, UpdateTodoDto } from './todo.dto';
import { MemberEntity } from './../model/member.entity';
import { JwtAuthGuard } from './../jwt-auth.guard';
import { TodoService } from './todo.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@/user.decorator';
import { TodoEntity } from '@/model/todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(
    @User() member: MemberEntity,
    @Body() dto: CreateTodoDto,
  ) {
    return await this.todoService.create(member.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @User() member: MemberEntity,
    @Param('id') id: TodoEntity['id'],
    @Body() dto: UpdateTodoDto,
  ) {
    return await this.todoService.update(member.id, id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getAll() {
    return await this.todoService
      .getAll()
      .then((e) => e.map((todo) => new TodoEntity(todo)));
  }
}
