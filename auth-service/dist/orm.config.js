"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./auth/entities/user.entity");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/football_auth',
    entities: [user_entity_1.User],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: true,
});
//# sourceMappingURL=orm.config.js.map