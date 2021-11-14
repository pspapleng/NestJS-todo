import { IsString, IsUUID } from 'class-validator';
import { Members } from '../model/members.entity';

export class MembersDTO implements Readonly<MembersDTO> {
    @IsUUID()
    id: string;

    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

    public static from(dto: Partial<MembersDTO>) {
        const member = new MembersDTO();
        member.id = dto.id;
        member.name = dto.name;
        member.username = dto.username;
        member.password = dto.password;
        return member;
    }

    public static fromEntity(entity: Members) {
        return this.from({
            id: entity.id,
            name: entity.name,
            username: entity.username,
        });
    }

    public toEntity() {
        const member = new Members();
        member.name = this.name;
        member.username = this.username;
        member.password = this.password;
        return member;
    }
}