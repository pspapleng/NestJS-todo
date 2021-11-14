import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemDTO } from './item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
    constructor(private service: ItemService) { }

    @Get()
    public async getAll() {
        return await this.service.getAll();
    }
    @Post()
    public async post(@Body() dto: ItemDTO): Promise<ItemDTO> {
        return this.service.create(ItemDTO.from(dto));
    }
}