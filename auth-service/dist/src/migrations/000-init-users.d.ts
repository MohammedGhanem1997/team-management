import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitUsers0001700000000001 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
