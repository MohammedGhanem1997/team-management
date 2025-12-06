declare const _default: () => {
    port: number;
    jwtSecret: string;
    authService: {
        host: string;
        port: number;
    };
    teamService: {
        host: string;
        port: number;
    };
    rateLimit: {
        defaultIpLimit: number;
        windowMs: number;
        endpointLimits: {};
        apiKeyTiers: {
            free: number;
            pro: number;
            enterprise: number;
        };
        apiKeys: {};
    };
};
export default _default;
