"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard {
    constructor(jwt, config) {
        this.jwt = jwt;
        this.config = config;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const auth = req.headers['authorization'] || '';
        this.logger.log(`Auth attempt: ${req.method} ${req.url}`);
        if (!auth || !auth.startsWith('Bearer ')) {
            this.logger.warn('Missing or malformed Authorization header');
            throw new common_1.UnauthorizedException('Authorization header missing');
        }
        const token = auth.substring('Bearer '.length);
        const secret = this.config.get('JWT_SECRET');
        if (!secret) {
            this.logger.error('JWT_SECRET is not configured');
            throw new common_1.ForbiddenException('Server configuration error');
        }
        try {
            const payload = await this.jwt.verifyAsync(token, { secret });
            req.user = { id: payload.sub, email: payload.email };
            this.logger.log(`Auth success for user ${payload.sub}`);
            return true;
        }
        catch (e) {
            this.logger.warn(`Invalid token: ${e?.message || e}`);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map