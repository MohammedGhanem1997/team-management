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
exports.Team = void 0;
const typeorm_1 = require("typeorm");
const player_entity_1 = require("./player.entity");
const base_entity_1 = require("../../common/base.entity");
let Team = class Team extends base_entity_1.BaseEntityCommon {
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Team.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Team.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["creating", "ready", "error"],
        default: "creating",
    }),
    __metadata("design:type", String)
], Team.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_entity_1.Player, (player) => player.team),
    __metadata("design:type", Array)
], Team.prototype, "players", void 0);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)("teams")
], Team);
//# sourceMappingURL=team.entity.js.map