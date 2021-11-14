import { configService } from '../config/config.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AES } from 'crypto-js';
import { Members } from '../model/members.entity';
import { MembersDTO } from './members.dto';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Members) private readonly repo: Repository<Members>
    ) { }

    public async getAll() {
        return await this.repo.find();
    }

    public async getByUsername(username: string) {
        return await this.repo.findOne({
            where: {
                username,
            },
        });
    }

    public async create(dto: MembersDTO): Promise<MembersDTO> {
        dto.password = AES.encrypt(
            dto.password,
            configService.getSecret(),
        ).toString();
        return this.repo.save(dto.toEntity()).then((e) => MembersDTO.fromEntity(e));
    }
}
