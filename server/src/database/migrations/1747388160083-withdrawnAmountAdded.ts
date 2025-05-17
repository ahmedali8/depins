import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawnAmountAdded1747388160083 implements MigrationInterface {
    name = 'WithdrawnAmountAdded1747388160083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "amountWithdrawn" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "amountWithdrawn"`);
    }

}
