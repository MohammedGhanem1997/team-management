import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class JwtAuthGuard implements CanActivate {
    private jwt;
    private config;
    private readonly logger;
    constructor(jwt: JwtService, config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
