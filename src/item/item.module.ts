import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './../model/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [],
})
export class ItemModule { }
