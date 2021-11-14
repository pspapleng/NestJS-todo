import { Body, Controller, Get, Post, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { MembersDTO } from './members.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
    constructor(private service: MembersService) { }

    @Get()
    public async getAll() {
        return await this.service.getAll();
    }
    @Get(':username')
    public async getByUsername(@Param('username') username: string) {
        return await this.service.getByUsername(username);
    }
    @Post()
    public async post(@Body() dto: MembersDTO, @Res() res: Response) {
        return this.service.create(MembersDTO.from(dto))
            .then(value => { return res.json(value); })
            .catch((error) => {
                return res.status(400).send(error.message);
            });
    }
}