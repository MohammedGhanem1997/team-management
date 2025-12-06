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
exports.ImprovePlayerSkillRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ImprovePlayerSkillRequestDto {
}
exports.ImprovePlayerSkillRequestDto = ImprovePlayerSkillRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Player identifier", format: "uuid" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ImprovePlayerSkillRequestDto.prototype, "player_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["pace", "shooting", "passing", "dribbling", "defending", "physical"], description: "Which skill to improve" }),
    (0, class_validator_1.IsEnum)(["pace", "shooting", "passing", "dribbling", "defending", "physical"]),
    __metadata("design:type", String)
], ImprovePlayerSkillRequestDto.prototype, "improvement_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 10, description: "Improvement amount (1-10)" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], ImprovePlayerSkillRequestDto.prototype, "value", void 0);
//# sourceMappingURL=improve-player-skill.request.dto.js.map