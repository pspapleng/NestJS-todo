import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from '../model/members.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Members])],
    providers: [MembersService],
    controllers: [MembersController],
    exports: [],
})
export class MembersModule { }