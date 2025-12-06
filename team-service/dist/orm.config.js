"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team/entities/team.entity");
const player_entity_1 = require("./team/entities/player.entity");
const player_skill_improvement_entity_1 = require("./team/entities/player-skill-improvement.entity");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/football_teams',
    entities: [team_entity_1.Team, player_entity_1.Player, player_skill_improvement_entity_1.PlayerSkillImprovement],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: true,
});
//# sourceMappingURL=orm.config.js.map