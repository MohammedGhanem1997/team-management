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
const transfer_service_1 = require("./transfer.service");
const transfer_filter_dto_1 = require("./dto/transfer-filter.dto");
let TransferController = class TransferController {
    constructor(transferService) {
        this.transferService = transferService;
    }
    async getTransfers(filters) {
        return this.transferService.getTransfers(filters);
    }
    async listPlayer(data) {
        return this.transferService.listPlayer(data.userId, data);
    }
    async removePlayerFromTransferList(data) {
        return this.transferService.removePlayerFromTransferList(data.userId, data.playerId);
    }
    async buyPlayer(data) {
        return this.transferService.buyPlayer(data.userId, data);
    }
};
exports.TransferController = TransferController;
__decorate([
    (0, microservices_1.MessagePattern)("get_transfers"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_filter_dto_1.TransferFilterDto]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "getTransfers", null);
__decorate([
    (0, microservices_1.MessagePattern)("list_player"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "listPlayer", null);
__decorate([
    (0, microservices_1.MessagePattern)("remove_player_from_transfer"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "removePlayerFromTransferList", null);
__decorate([
    (0, microservices_1.MessagePattern)("buy_player"),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "buyPlayer", null);
exports.TransferController = TransferController = __decorate([
    (0, common_1.Controller)("transfers"),
    __metadata("design:paramtypes", [transfer_service_1.TransferService])
], TransferController);
//# sourceMappingURL=transfer.controller.js.map