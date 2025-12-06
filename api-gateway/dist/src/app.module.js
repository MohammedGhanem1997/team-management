"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const auth_controller_1 = require("./auth/auth.controller");
const team_controller_1 = require("./team/team.controller");
const transfer_controller_1 = require("./transfer/transfer.controller");
const player_controller_1 = require("./player/player.controller");
const admin_controller_1 = require("./admin/admin.controller");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const throttler_1 = require("@nestjs/throttler");
const config_2 = require("./config");
const core_1 = require("@nestjs/core");
const api_throttler_guard_1 = require("./common/guards/api-throttler.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [config_2.default] }),
            axios_1.HttpModule,
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    ttl: Math.floor((config.get("rateLimit.windowMs") || 60000) / 1000),
                    limit: config.get("rateLimit.defaultIpLimit") || 100,
                }),
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get("jwtSecret"),
                    signOptions: { expiresIn: "7d" },
                }),
            }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: "AUTH_SERVICE",
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: config.get("authService.host") || "auth-service",
                            port: config.get("authService.port") || 3003,
                        },
                    }),
                },
                {
                    name: "TEAM_SERVICE",
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [
                                config.get("RABBITMQ_URL") || "amqp://rabbitmq:5672",
                            ],
                            queue: "team_queue",
                            queueOptions: { durable: false },
                        },
                    }),
                },
            ]),
        ],
        controllers: [
            auth_controller_1.AuthController,
            team_controller_1.TeamController,
            transfer_controller_1.TransferController,
            player_controller_1.PlayerController,
            admin_controller_1.AdminController,
        ],
        providers: [{ provide: core_1.APP_GUARD, useClass: api_throttler_guard_1.ApiThrottlerGuard }],
    })
], AppModule);
class JwtAuthGuard {
    canActivate() {
        return true;
    }
}
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=app.module.js.map