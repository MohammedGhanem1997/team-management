"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: Number(process.env.AUTH_SERVICE_PORT || 3001),
    databaseUrl: process.env.DATABASE_URL,
    rmqUrl: process.env.RABBITMQ_URL,
    jwtSecret: process.env.JWT_SECRET,
});
//# sourceMappingURL=app.config.js.map