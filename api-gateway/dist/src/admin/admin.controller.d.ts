import { ConfigService } from '@nestjs/config';
declare class SetRateLimitDto {
    endpoint: string;
    limit: number;
}
export declare class AdminController {
    private config;
    constructor(config: ConfigService);
    setRateLimit(dto: SetRateLimitDto): Promise<{
        success: boolean;
        endpoint: string;
        limit: number;
    }>;
}
export {};
