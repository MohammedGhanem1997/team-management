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
exports.ImprovePlayerSkillResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const player_dto_1 = require("./player.dto");
class ImprovePlayerSkillResponseDto {
}
exports.ImprovePlayerSkillResponseDto = ImprovePlayerSkillResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Operation success status" }),
    __metadata("design:type", Boolean)
], ImprovePlayerSkillResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: player_dto_1.PlayerDto }),
    __metadata("design:type", player_dto_1.PlayerDto)
], ImprovePlayerSkillResponseDto.prototype, "updated_player_data", void 0);
//# sourceMappingURL=improve-player-skill.response.dto.js.map