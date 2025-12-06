"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: Number(process.env.TEAM_SERVICE_PORT || 3002),
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/football_teams',
    rmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    initialBudget: 5000000,
    positionCounts: { GK: 3, DEF: 6, MID: 6, ATT: 5 },
    transferDiscount: 0.95,
});
//# sourceMappingURL=app.config.js.map