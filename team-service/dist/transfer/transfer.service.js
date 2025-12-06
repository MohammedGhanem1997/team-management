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
exports.TransferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("../team/entities/team.entity");
const player_entity_1 = require("../team/entities/player.entity");
const config_1 = require("@nestjs/config");
const TRANSFER_DISCOUNT = 0.95;
const MIN_TEAM_SIZE = 15;
const MAX_TEAM_SIZE = 25;
let TransferService = class TransferService {
    constructor(teamRepository, playerRepository, configService) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.configService = configService;
    }
    async getTransfers(filters) {
        const query = {
            where: { isOnTransferList: true },
            relations: ["team"],
        };
        if (filters.playerName) {
            query.where = [
                { isOnTransferList: true, first_name: (0, typeorm_2.Like)(`%${filters.playerName}%`) },
                { isOnTransferList: true, last_name: (0, typeorm_2.Like)(`%${filters.playerName}%`) },
            ];
        }
        if (filters.teamName && filters.teamName !== "") {
            query.relations = ["team"];
            query.where.team = { name: (0, typeorm_2.Like)(`%${filters.teamName}%`) };
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.where.askingPrice = (0, typeorm_2.Between)(filters.minPrice || 0, filters.maxPrice || 999999999);
        }
        return this.playerRepository.find(query);
    }
    async listPlayer(userId, listPlayerDto) {
        const { playerId, askingPrice } = listPlayerDto;
        const player = await this.playerRepository.findOne({
            where: { id: playerId },
            relations: ["team"],
        });
        if (!player) {
            throw new common_1.NotFoundException("Player not found");
        }
        if (player.team.userId !== userId) {
            throw new common_1.ConflictException("You can only list players from your own team");
        }
        if (player.isOnTransferList) {
            throw new common_1.ConflictException("Player is already on transfer list");
        }
        player.isOnTransferList = true;
        player.askingPrice = askingPrice;
        return this.playerRepository.save(player);
    }
    async removePlayerFromTransferList(userId, playerId) {
        const player = await this.playerRepository.findOne({
            where: { id: playerId },
            relations: ["team"],
        });
        if (!player) {
            throw new common_1.NotFoundException("Player not found");
        }
        if (player.team.userId !== userId) {
            throw new common_1.ConflictException("You can only remove players from your own team");
        }
        if (!player.isOnTransferList) {
            throw new common_1.ConflictException("Player is not on transfer list");
        }
        player.isOnTransferList = false;
        player.askingPrice = undefined;
        return this.playerRepository.save(player);
    }
    async buyPlayer(userId, buyPlayerDto) {
        const { playerId } = buyPlayerDto;
        const player = await this.playerRepository.findOne({
            where: { id: playerId },
            relations: ["team"],
        });
        if (!player) {
            throw new common_1.NotFoundException("Player not found");
        }
        if (!player.isOnTransferList) {
            throw new common_1.ConflictException("Player is not on transfer list");
        }
        if (player.team.userId === userId) {
            throw new common_1.ConflictException("You cannot buy your own player");
        }
        const buyerTeam = await this.teamRepository.findOne({ where: { userId } });
        if (!buyerTeam) {
            throw new common_1.NotFoundException("Buyer team not found");
        }
        const sellerTeam = player.team;
        const discount = this.configService.get("transferDiscount") ?? TRANSFER_DISCOUNT;
        const purchasePrice = Math.floor(player.askingPrice * discount);
        if (buyerTeam.budget < purchasePrice) {
            throw new common_1.ConflictException("Insufficient budget");
        }
        const currentTeamSize = await this.playerRepository.count({
            where: { teamId: buyerTeam.id },
        });
        if (currentTeamSize >= MAX_TEAM_SIZE) {
            throw new common_1.ConflictException(`Team cannot have more than ${MAX_TEAM_SIZE} players`);
        }
        buyerTeam.budget -= purchasePrice;
        sellerTeam.budget += purchasePrice;
        await this.teamRepository.save([buyerTeam, sellerTeam]);
        player.teamId = buyerTeam.id;
        player.isOnTransferList = false;
        player.askingPrice = undefined;
        await this.playerRepository.save(player);
    }
    async getPlayerById(playerId) {
        const player = await this.playerRepository.findOne({
            where: { id: playerId },
            relations: ["team"],
        });
        if (!player) {
            throw new common_1.NotFoundException("Player not found");
        }
        return player;
    }
};
exports.TransferService = TransferService;
exports.TransferService = TransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], TransferService);
//# sourceMappingURL=transfer.service.js.map