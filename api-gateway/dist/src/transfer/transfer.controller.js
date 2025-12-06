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
exports.TransferController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
const transfer_filter_dto_1 = require("./dto/transfer-filter.dto");
const list_player_dto_1 = require("./dto/list-player.dto");
const buy_player_dto_1 = require("./dto/buy-player.dto");
let TransferController = class TransferController {
    constructor(teamServiceClient) {
        this.teamServiceClient = teamServiceClient;
    }
    async getTransfers(filters) {
        return (0, rxjs_1.firstValueFrom)(this.teamServiceClient.send("get_transfers", filters));
    }
    async listPlayer(req, listPlayerDto) {
        return (0, rxjs_1.firstValueFrom)(this.teamServiceClient.send("list_player", {
            userId: req.user.id,
            ...listPlayerDto,
        }));
    }
    async removePlayerFromTransferList(req, playerId) {
        return (0, rxjs_1.firstValueFrom)(this.teamServiceClient.send("remove_player_from_transfer", {
            userId: req.user.id,
            playerId,
        }));
    }
    async buyPlayer(req, buyPlayerDto) {
        return (0, rxjs_1.firstValueFrom)(this.teamServiceClient.send("buy_player", {
            userId: req.user.id,
            ...buyPlayerDto,
        }));
    }
};
exports.TransferController = TransferController;
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.Throttle)(60, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get available transfers" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Transfers retrieved successfully" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_filter_dto_1.TransferFilterDto]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "getTransfers", null);
__decorate([
    (0, common_1.Post)("list-player"),
    (0, throttler_1.Throttle)(20, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "List player on transfer market" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Player listed successfully" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_player_dto_1.ListPlayerDto]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "listPlayer", null);
__decorate([
    (0, common_1.Post)("remove-player"),
    (0, throttler_1.Throttle)(20, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Remove player from transfer list" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Player removed successfully" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("playerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "removePlayerFromTransferList", null);
__decorate([
    (0, common_1.Post)("buy-player"),
    (0, throttler_1.Throttle)(20, 60),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Buy player from transfer market" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Player purchased successfully" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, buy_player_dto_1.BuyPlayerDto]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "buyPlayer", null);
exports.TransferController = TransferController = __decorate([
    (0, swagger_1.ApiTags)("Transfer Market"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("transfers"),
    __param(0, (0, common_1.Inject)("TEAM_SERVICE")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], TransferController);
//# sourceMappingURL=transfer.controller.js.map