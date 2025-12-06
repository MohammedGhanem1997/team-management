import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes0061700000007000 implements MigrationInterface {
  name = "AddIndexes0061700000007000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_player_team ON player("teamId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_player_position ON player("position")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_improve_player ON player_skill_improvements("playerId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_improve_date ON player_skill_improvements("improvementDate")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_player_team`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_player_position`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_improve_player`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_improve_date`);
  }
}

