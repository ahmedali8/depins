import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDesktopEntityAdded1747212122590 implements MigrationInterface {
    name = 'UserDesktopEntityAdded1747212122590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-desktop" ("id" SERIAL NOT NULL, "anydeskId" text NOT NULL, "walletPublicKey" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_53543bbc38c5b74a0c86edb2d5d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user-desktop"`);
    }

}
