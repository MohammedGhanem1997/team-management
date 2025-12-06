"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAllEntities0051700000006000 = void 0;
const typeorm_1 = require("typeorm");
class CreateAllEntities0051700000006000 {
    constructor() {
        this.name = "CreateAllEntities0051700000006000";
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "teams",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "userId", type: "varchar", isNullable: false },
                { name: "name", type: "varchar", isNullable: false },
                { name: "budget", type: "int", isNullable: false },
                { name: "status", type: "varchar", isNullable: false, default: "'creating'" },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
            ],
        }));
        await queryRunner.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'player_position_enum') THEN
        CREATE TYPE player_position_enum AS ENUM ('GK', 'DEF', 'MID', 'ATT');
      END IF;
    END $$;`);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "player",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "first_name", type: "varchar", length: "50", isNullable: false },
                { name: "last_name", type: "varchar", length: "50", isNullable: false },
                { name: "position", type: "player_position_enum", isNullable: false },
                { name: "age", type: "int", isNullable: false },
                { name: "market_value", type: "decimal", precision: 10, scale: 2, isNullable: false },
                { name: "overall_rating", type: "int", isNullable: false },
                { name: "pace", type: "int", isNullable: false },
                { name: "shooting", type: "int", isNullable: false },
                { name: "passing", type: "int", isNullable: false },
                { name: "dribbling", type: "int", isNullable: false },
                { name: "defending", type: "int", isNullable: false },
                { name: "physical", type: "int", isNullable: false },
                { name: "teamId", type: "uuid", isNullable: true },
                { name: "isOnTransferList", type: "boolean", isNullable: false, default: false },
                { name: "askingPrice", type: "int", isNullable: true },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
            ],
            checks: [
                { expression: 'age BETWEEN 16 AND 40' },
                { expression: 'overall_rating BETWEEN 1 AND 100' },
                { expression: 'pace BETWEEN 1 AND 100' },
                { expression: 'shooting BETWEEN 1 AND 100' },
                { expression: 'passing BETWEEN 1 AND 100' },
                { expression: 'dribbling BETWEEN 1 AND 100' },
                { expression: 'defending BETWEEN 1 AND 100' },
                { expression: 'physical BETWEEN 1 AND 100' },
            ],
        }));
        await queryRunner.createForeignKey("player", new typeorm_1.TableForeignKey({
            columnNames: ["teamId"],
            referencedTableName: "teams",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'player_skill_improvements',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                { name: 'playerId', type: 'uuid', isNullable: false },
                { name: 'skill', type: 'varchar', isNullable: false },
                { name: 'improvementDate', type: 'date', isNullable: false },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
            ],
            uniques: [
                { columnNames: ['playerId', 'skill', 'improvementDate'] }
            ]
        }));
        await queryRunner.createForeignKey('player_skill_improvements', new typeorm_1.TableForeignKey({
            columnNames: ['playerId'],
            referencedTableName: 'player',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const impTable = await queryRunner.getTable('player_skill_improvements');
        if (impTable) {
            const fk = impTable.foreignKeys.find(f => f.columnNames.includes('playerId'));
            if (fk)
                await queryRunner.dropForeignKey('player_skill_improvements', fk);
            await queryRunner.dropTable('player_skill_improvements');
        }
        const playerTable = await queryRunner.getTable('player');
        if (playerTable) {
            const fk = playerTable.foreignKeys.find(f => f.columnNames.includes('teamId'));
            if (fk)
                await queryRunner.dropForeignKey('player', fk);
            await queryRunner.dropTable('player');
        }
        await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'player_position_enum') THEN
        DROP TYPE player_position_enum;
      END IF;
    END $$;`);
        const teamsTable = await queryRunner.getTable('teams');
        if (teamsTable) {
            await queryRunner.dropTable('teams');
        }
    }
}
exports.CreateAllEntities0051700000006000 = CreateAllEntities0051700000006000;
//# sourceMappingURL=005-create-all-entities.js.map