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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
let TeamController = class TeamController {
    constructor(teamServiceClient) {
        this.teamServiceClient = teamServiceClient;
    }
    async getMyTeam(req) {
        return (0, rxjs_1.firstValueFrom)(this.teamServiceClient.send("get_my_team", { userId: req.user.id }));
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Get)("my-team"),
    (0, throttler_1.Throttle)(30, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get user team" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team retrieved successfully" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getMyTeam", null);
exports.TeamController = TeamController = __decorate([
    (0, swagger_1.ApiTags)("Team Management"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("teams"),
    __param(0, (0, common_1.Inject)("TEAM_SERVICE")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], TeamController);
//# sourceMappingURL=team.controller.js.map