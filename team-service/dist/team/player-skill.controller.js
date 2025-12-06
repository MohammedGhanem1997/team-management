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
var PlayerSkillController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSkillController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const team_service_1 = require("./team.service");
const improve_player_skill_dto_1 = require("./dto/improve-player-skill.dto");
let PlayerSkillController = PlayerSkillController_1 = class PlayerSkillController {
    constructor(teamService) {
        this.teamService = teamService;
        this.logger = new common_1.Logger(PlayerSkillController_1.name);
    }
    async improveSkillHttp(playerId, body) {
        this.logger.log(`Improving skill ${body.skill} by ${body.amount} for player ${playerId}`);
        const userId = "http-user-context";
        const res = await this.teamService.improvePlayerSkill(userId, playerId, body.skill, body.amount);
        return res;
    }
    async improveSkillMessage(data) {
        this.logger.log(`RMQ improve skill ${data.skill} amt ${data.amount} for player ${data.playerId} by user ${data.userId}`);
        return this.teamService.improvePlayerSkill(data.userId, data.playerId, data.skill, data.amount);
    }
};
exports.PlayerSkillController = PlayerSkillController;
__decorate([
    (0, common_1.Post)(":playerId/skills"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)("playerId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, improve_player_skill_dto_1.ImprovePlayerSkillDto]),
    __metadata("design:returntype", Promise)
], PlayerSkillController.prototype, "improveSkillHttp", null);
__decorate([
    (0, microservices_1.MessagePattern)("improve_player_skill"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerSkillController.prototype, "improveSkillMessage", null);
exports.PlayerSkillController = PlayerSkillController = PlayerSkillController_1 = __decorate([
    (0, common_1.Controller)("players"),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], PlayerSkillController);
//# sourceMappingURL=player-skill.controller.js.map