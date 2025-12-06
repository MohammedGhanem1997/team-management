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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
class SetRateLimitDto {
}
let AdminController = class AdminController {
    constructor(config) {
        this.config = config;
    }
    async setRateLimit(dto) {
        if (!dto.endpoint || typeof dto.limit !== 'number') {
            throw new common_1.BadRequestException('Invalid payload');
        }
        const current = this.config.get('rateLimit.endpointLimits') || {};
        current[dto.endpoint] = dto.limit;
        this.config.internalConfig = {
            ...(this.config.internalConfig || {}),
            rateLimit: { ...(this.config.get('rateLimit') || {}), endpointLimits: current },
        };
        return { success: true, endpoint: dto.endpoint, limit: dto.limit };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('rate-limit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetRateLimitDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setRateLimit", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map