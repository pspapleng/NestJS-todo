import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'members' })
export class Members extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    username: string;

    @Column({ type: 'text', nullable: false })
    password: string;
}
