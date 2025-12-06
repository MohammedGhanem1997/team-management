import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
export declare class ApiThrottlerGuard extends ThrottlerGuard {
    private readonly config;
    constructor(options: ThrottlerModuleOptions, storage: ThrottlerStorage, reflector: Reflector, config: ConfigService);
    protected getTracker(req: Record<string, any>): string;
    handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
}
