"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: Number(process.env.API_GATEWAY_PORT || 3000),
    jwtSecret: process.env.JWT_SECRET,
    authService: {
        host: process.env.AUTH_SERVICE_HOST || "auth-service",
        port: Number(process.env.AUTH_TCP_PORT || 3003),
    },
    teamService: {
        host: process.env.TEAM_SERVICE_HOST || "team-service",
        port: Number(process.env.TEAM_SERVICE_PORT || 3002),
    },
    rateLimit: {
        defaultIpLimit: Number(process.env.RL_DEFAULT_IP || 100),
        windowMs: Number(process.env.RL_WINDOW_MS || 60000),
        endpointLimits: {},
        apiKeyTiers: { free: 100, pro: 500, enterprise: 2000 },
        apiKeys: {},
    },
});
//# sourceMappingURL=app.config.js.map