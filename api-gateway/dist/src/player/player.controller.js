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
var PlayerController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
const improve_player_skill_dto_1 = require("./dto/improve-player-skill.dto");
const improve_player_skill_request_dto_1 = require("./dto/improve-player-skill.request.dto");
const improve_player_skill_response_dto_1 = require("./dto/improve-player-skill.response.dto");
let PlayerController = PlayerController_1 = class PlayerController {
    constructor(teamServiceClient) {
        this.teamServiceClient = teamServiceClient;
        this.logger = new common_1.Logger(PlayerController_1.name);
    }
    async improveSkill(playerId, body) {
        try {
            const userId = "gateway-user-context";
            this.logger.log(`Gateway improve skill ${body.skill} by ${body.amount} for player ${playerId}`);
            const obs = this.teamServiceClient
                .send("improve_player_skill", {
                userId,
                playerId,
                skill: body.skill,
                amount: body.amount,
            })
                .pipe((0, rxjs_1.timeout)(5000), (0, rxjs_1.catchError)((err) => {
                this.logger.error(`Circuit breaker tripped: ${err?.message || err}`);
                throw err;
            }));
            return await (0, rxjs_1.firstValueFrom)(obs);
        }
        catch (err) {
            const { buildHttpException } = await Promise.resolve().then(() => require("../common/errors/error.helper"));
            throw buildHttpException(err, PlayerController_1.name);
        }
    }
    async improveSkillV1(reqBody) {
        try {
            const userId = "gateway-user-context";
            this.logger.log(`Gateway v1 improve skill ${reqBody.improvement_type} by ${reqBody.value} for player ${reqBody.player_id}`);
            const obs = this.teamServiceClient
                .send("improve_player_skill", {
                userId,
                playerId: reqBody.player_id,
                skill: reqBody.improvement_type,
                amount: reqBody.value,
            })
                .pipe((0, rxjs_1.timeout)(5000), (0, rxjs_1.catchError)((err) => {
                this.logger.error(`Circuit breaker tripped: ${err?.message || err}`);
                throw err;
            }));
            const updated = await (0, rxjs_1.firstValueFrom)(obs);
            const resp = {
                success: true,
                updated_player_data: updated,
            };
            return resp;
        }
        catch (err) {
            const { buildHttpException } = await Promise.resolve().then(() => require("../common/errors/error.helper"));
            throw buildHttpException(err, PlayerController_1.name);
        }
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Post)(":playerId/skills"),
    (0, throttler_1.Throttle)(20, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Improve player skill" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Skill improved" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Player not found" }),
    (0, swagger_1.ApiResponse)({ status: 503, description: "Service unavailable" }),
    __param(0, (0, common_1.Param)("playerId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, improve_player_skill_dto_1.ImprovePlayerSkillDto]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "improveSkill", null);
__decorate([
    (0, common_1.Post)("v1/players/improve"),
    (0, throttler_1.Throttle)(20, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Improve player skill (v1)" }),
    (0, swagger_1.ApiBody)({
        type: improve_player_skill_request_dto_1.ImprovePlayerSkillRequestDto,
        required: true,
        examples: {
            improvePace: {
                summary: "Improve pace by 3",
                value: {
                    player_id: "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
                    improvement_type: "pace",
                    value: 3,
                },
            },
            improveShooting: {
                summary: "Improve shooting by 2",
                value: {
                    player_id: "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
                    improvement_type: "shooting",
                    value: 2,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Skill improved",
        type: improve_player_skill_response_dto_1.ImprovePlayerSkillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Invalid parameters (range 1-10, valid skill type)",
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Player not found or not owned by user",
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Internal server error" }),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [improve_player_skill_request_dto_1.ImprovePlayerSkillRequestDto]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "improveSkillV1", null);
exports.PlayerController = PlayerController = PlayerController_1 = __decorate([
    (0, swagger_1.ApiTags)("Players"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("players"),
    __param(0, (0, common_1.Inject)("TEAM_SERVICE")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], PlayerController);
//# sourceMappingURL=player.controller.js.map