import { MigrationInterface, QueryRunner } from "typeorm";

export class WalletKeysAdded1747065283045 implements MigrationInterface {
    name = 'WalletKeysAdded1747065283045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" text, "dateJoined" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastActive" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "walletPublicKey" text NOT NULL, "walletPrivateKey" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_594cfa6e6b9e1a96d74e2b36cf0" UNIQUE ("walletPublicKey"), CONSTRAINT "UQ_898af65f6187015c9ff41ae7fdb" UNIQUE ("walletPrivateKey"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
