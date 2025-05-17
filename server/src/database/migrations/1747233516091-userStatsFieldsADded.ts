import { MigrationInterface, QueryRunner } from "typeorm";

export class UserStatsFieldsADded1747233516091 implements MigrationInterface {
    name = 'UserStatsFieldsADded1747233516091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActive"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "marinadeDespoited" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "grassEarned" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "grassEarned"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "marinadeDespoited"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActive" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

}
