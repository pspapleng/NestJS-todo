## Pre Requisite

- docker and docker-compose
- node.js
- nest.js cli

## Feature

- [x] Ready To Run.
- [x] Postgres Database as Container.
- [x] Config Service
- Read and Ensure .env variable.
- [x] .env Sample.
- [x] Connect Postgres Database.

**Member**

- [x] Register Member.
- [x] **X-Member-Token**

**Todo**

- [x] Only member can create new todo with **not_started** status.
- [x] Every member can list **existing** todo.
- [x] Only todo **owner** can update their **title** and **description**.
- [x] Only todo **owner** can change status.
- [x] Only todo **owner** can delete todo(soft delete).
- [x] Only todo **owner** can assign member.
- [x] Send notification to all assigned member when **owner** delete **active** todo.
- [x] Run a **background scheduler** to notify all assigned members.

**Other**

- [x] Authorization --> UseGuards()
- [x] Rate Limiting from header **X-Forwarded-For**

## Getting Started

### How to Run Project

1.  Clone Project

    ```
    git clone https://github.com/pspapleng/NestJS-todo.git

    npm install
    ```

2.  Run Database As Container
    ```
    docker-compose up -d
    ```
3.  Run Project
    ```
    npm run start:dev
    ```

### How to Run Migration

1.  Generate Migration
    ```
    npm run typeorm:migration:generate -- init
    ```
2.  Run Migration
    ```
    npm run typeorm:migration:run
    ```

---

## Step by Step

### Install Nestjs/CLI and Create Project

```
npm i -g @nestjs/cli
nest new project-name
```

- You can remove **app.controller.spec.ts, app.controller.ts, app.service.ts**

---

### Nodemon And ts-node

1. ติดตั้ง nodemon และ ts-node เพื่อช่วยในการทำ hot-reload

```
npm i --save-dev nodemon ts-node
```

2. สร้างไฟล์ชื่อ **nodemon.json** ที่ตำแหน่งเดียวกับ package.json

```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "node --inspect=127.0.0.1:9223 -r ts-node/register -- src/main.ts",
  "env": {}
}
```

3. แก้ไข scripts ใน package.json ส่วนของ **start:dev**

```
"start:dev": "nodemon --config nodemon.json",
```

---

### Typeorm

1. ติดตั้ง package

```
npm install --save @nestjs/typeorm typeorm pg dotenv
```

2. create **.env**

```
PORT=3000
MODE=DEV
JWT_SECRET=changme

POSTGRES_HOST=changme
POSTGRES_PORT=changme
POSTGRES_USER=changme
POSTGRES_PASSWORD=changme
POSTGRES_DATABASE=changme
```

3. สร้างไฟล์ชื่อ **src/config/config.server.ts** สำหรับจัดการการตั้งค่าจาก environment variable(.env)

```typescript
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    /* istanbul ignore next */
    if (!value && throwOnMissing)
      throw new Error(`config error - missing env.${key}`);

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getSaltRounds() {
    return 8;
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['src/model/**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      migrationsRun: Boolean(this.getValue('RUN_MIGRATIONS')),
      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
      keepConnectionAlive: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'RUN_MIGRATIONS',
  'JWT_SECRET',
]);

export { configService };
```

4. เรียกใช้งาน typeorm และ configService ใน **app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

5. Run Project

```
  npm run start:dev
```

---

### Run Postgres Database and PG Admin with docker-compose

1. create docker-compose.yaml

```yaml
version: '3.7'

services:
  postgres:
    image: postgres:14.1
    env_file: .env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DATABASE}
    ports:
      - ${POSTGRES_PORT}:5432
  pg_admin:
    image: dpage/pgadmin4:6.1
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: changeme
    ports:
      - 8081:80
    volumes:
      - pgadmin_pv:/var/lib/pgadmin

volumes:
  pgadmin_pv:
```

2.  Run Postgres Database As Container

```
  docker-compose up -d
```

---

### Database Migration

1. สร้างไฟล์ **src/scripts/write-type-orm-config.ts** เพื่อสร้างไฟล์ **ormconfig.json** ในตำแหน่งเดียวกับ package.json

- เนื่องจากเราทำ config เป็น configServer ทำให้ typeorm cli ไม่สามารถอ่านได้ ทำให้ typeorm cli ต้องอ่านการตั้งค่าจากไฟล์ **ormconfig.json**

```typescript
import { configService } from '../config/config.service';
import fs = require('fs');
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
```

2. แก้ไขไฟล์ package.json สำหรับเรียกใช้งานคำสั่งของ typeorm

```json
  "pretypeorm": "rimraf ormconfig.json && ts-node -r tsconfig-paths/register src/scripts/write-type-orm-config.ts",
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
  "typeorm:migration:generate": "npm run typeorm -- migration:generate -n",
  "typeorm:migration:run": "npm run typeorm -- migration:run",
  "typeorm:migration:revert": "npm run typeorm -- migration:revert"
```

3. รันคำสั่ง เพื่อสร้างไฟล์ ormconfig.json

```
  npm run pretypeorm
```

4. สร้างไฟล์ **src/model/base.entity.ts** เพื่อระบุ column ที่ทุก table ต้องมีเหมือนกัน

```typescript
import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updateAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt: Date;
}
```

5. สร้างไฟล์ **model/member.entity.ts**

```typescript
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'members' })
export class MemberEntity extends BaseEntity {
  // class-validate
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: false }) // typeORM
  name: string;

  // class-validate
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: false }) // typeORM
  username: string;

  // @Exclude()
  @Exclude({ toPlainOnly: true })
  // class-validate
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Column({ type: 'text', nullable: false }) // typeORM
  password: string;

  constructor(partial: Partial<MemberEntity>) {
    super();
    Object.assign(this, partial);
  }
}
```

6. สร้างไฟล์ **model/todo.entity.ts**

```typescript
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MemberEntity } from './member.entity';

export enum TODO_STATUS {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETE,
}

@Entity({ name: 'todos' })
export class TodoEntity extends BaseEntity {
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @IsEnum(TODO_STATUS)
  @Column({
    type: 'enum',
    enum: TODO_STATUS,
    default: TODO_STATUS.NOT_STARTED,
  })
  status: TODO_STATUS;

  @Type(() => Date)
  @IsDate()
  @Column({ type: 'timestamptz', nullable: false })
  due_date: Date;

  constructor(partial: Partial<TodoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
```

7. สร้างไฟล์ **model/assignedMembers.entity.ts**

```typescript
import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MemberEntity } from './member.entity';
import { TodoEntity } from './todo.entity';

@Entity({ name: 'assigned_members' })
@Unique(['todo', 'member'])
export class AssignedMemberEntity extends BaseEntity {
  @ManyToOne(() => TodoEntity)
  @JoinColumn({ name: 'todo_id' })
  todo: TodoEntity;

  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;
}
```

8.  Generate Migration

```
  npm run typeorm:migration:generate -- init
```

9.  Run Migration and See Result in PGAdmin

```
  npm run typeorm:migration:run
```

---
