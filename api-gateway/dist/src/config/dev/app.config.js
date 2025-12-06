"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: Number(process.env.API_GATEWAY_PORT || 3000),
    jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
    authService: {
        host: `${process.env.AUTH_SERVICE_HOST || "auth-service"}`,
        port: Number(process.env.AUTH_TCP_PORT || 3003),
    },
    teamService: {
        host: `${process.env.TEAM_SERVICE_HOST || "localhost"}`,
        port: Number(process.env.TEAM_SERVICE_PORT || 3002),
    },
    rateLimit: {
        defaultIpLimit: 100,
        windowMs: 60000,
        endpointLimits: {
            "/transfers": 60,
            "/teams/my-team": 30,
        },
        apiKeyTiers: { free: 100, pro: 500, enterprise: 2000 },
        apiKeys: {},
    },
});
//# sourceMappingURL=app.config.js.map