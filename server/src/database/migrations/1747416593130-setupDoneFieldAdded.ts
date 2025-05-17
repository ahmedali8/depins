import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupDoneFieldAdded1747416593130 implements MigrationInterface {
    name = 'SetupDoneFieldAdded1747416593130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-desktop" ADD "setupDone" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-desktop" DROP COLUMN "setupDone"`);
    }

}
