"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const microservices_1 = require("@nestjs/microservices");
const team_module_1 = require("./team/team.module");
const transfer_module_1 = require("./transfer/transfer.module");
const team_entity_1 = require("./team/entities/team.entity");
const player_entity_1 = require("./team/entities/player.entity");
const player_skill_improvement_entity_1 = require("./team/entities/player-skill-improvement.entity");
const config_2 = require("./config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [config_2.default] }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('databaseUrl'),
                    entities: [team_entity_1.Team, player_entity_1.Player, player_skill_improvement_entity_1.PlayerSkillImprovement],
                    synchronize: false,
                    logging: false,
                    migrationsRun: true,
                    migrations: ['dist/migrations/*.js'],
                }),
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'AUTH_SERVICE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [config.get('rmqUrl')],
                            queue: 'auth_queue',
                            queueOptions: { durable: false },
                        },
                    }),
                },
            ]),
            team_module_1.TeamModule,
            transfer_module_1.TransferModule,
        ],
        providers: [jwt_strategy_1.JwtStrategy],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map