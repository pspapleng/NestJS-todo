import {MigrationInterface, QueryRunner} from "typeorm";

export class init1637076087045 implements MigrationInterface {
    name = 'init1637076087045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_03b9b76db4a5a56333146c93f80" UNIQUE ("username"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "members"`);
    }

}
