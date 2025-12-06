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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
let ApiThrottlerGuard = class ApiThrottlerGuard extends throttler_1.ThrottlerGuard {
    constructor(options, storage, reflector, config) {
        super(options, storage, reflector);
        this.config = config;
    }
    getTracker(req) {
        const apiKey = req.headers['x-api-key'];
        const ip = req.headers['x-forwarded-for'] || req.ip;
        return apiKey ? `apikey:${apiKey}` : `ip:${ip}`;
    }
    async handleRequest(context, limit, ttl) {
        const result = await super.handleRequest(context, limit, ttl);
        const res = context.switchToHttp().getResponse();
        try {
            res.setHeader('X-RateLimit-Limit', String(limit));
            const reset = Math.floor((Date.now() + ttl * 1000) / 1000);
            res.setHeader('X-RateLimit-Reset', String(reset));
        }
        catch { }
        return result;
    }
};
exports.ApiThrottlerGuard = ApiThrottlerGuard;
exports.ApiThrottlerGuard = ApiThrottlerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, core_1.Reflector, config_1.ConfigService])
], ApiThrottlerGuard);
//# sourceMappingURL=api-throttler.guard.js.map