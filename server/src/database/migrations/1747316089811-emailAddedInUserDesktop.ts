import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailAddedInUserDesktop1747316089811 implements MigrationInterface {
    name = 'EmailAddedInUserDesktop1747316089811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-desktop" ADD "email" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-desktop" DROP COLUMN "email"`);
    }

}
