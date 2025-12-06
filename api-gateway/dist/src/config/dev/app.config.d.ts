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
        endpointLimits: {
            "/transfers": number;
            "/teams/my-team": number;
        };
        apiKeyTiers: {
            free: number;
            pro: number;
            enterprise: number;
        };
        apiKeys: {};
    };
};
export default _default;
