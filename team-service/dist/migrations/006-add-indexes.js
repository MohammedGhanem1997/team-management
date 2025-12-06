"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexes0061700000007000 = void 0;
class AddIndexes0061700000007000 {
    constructor() {
        this.name = "AddIndexes0061700000007000";
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_player_team ON player("teamId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_player_position ON player("position")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_improve_player ON player_skill_improvements("playerId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_improve_date ON player_skill_improvements("improvementDate")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_player_team`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_player_position`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_improve_player`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_improve_date`);
    }
}
exports.AddIndexes0061700000007000 = AddIndexes0061700000007000;
//# sourceMappingURL=006-add-indexes.js.map