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
exports.PlayerSkillImprovement = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/base.entity");
const player_entity_1 = require("./player.entity");
let PlayerSkillImprovement = class PlayerSkillImprovement extends base_entity_1.BaseEntityCommon {
};
exports.PlayerSkillImprovement = PlayerSkillImprovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PlayerSkillImprovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlayerSkillImprovement.prototype, "playerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => player_entity_1.Player),
    (0, typeorm_1.JoinColumn)({ name: "playerId" }),
    __metadata("design:type", player_entity_1.Player)
], PlayerSkillImprovement.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: [
            "pace",
            "shooting",
            "passing",
            "dribbling",
            "defending",
            "physical",
        ] }),
    __metadata("design:type", String)
], PlayerSkillImprovement.prototype, "skill", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], PlayerSkillImprovement.prototype, "improvementDate", void 0);
exports.PlayerSkillImprovement = PlayerSkillImprovement = __decorate([
    (0, typeorm_1.Entity)("player_skill_improvements"),
    (0, typeorm_1.Unique)(["playerId", "skill", "improvementDate"])
], PlayerSkillImprovement);
//# sourceMappingURL=player-skill-improvement.entity.js.map