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
exports.TeamService = exports.POSITION_COUNTS = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("./entities/team.entity");
const player_entity_1 = require("./entities/player.entity");
const player_skill_improvement_entity_1 = require("./entities/player-skill-improvement.entity");
const config_1 = require("@nestjs/config");
exports.POSITION_COUNTS = {};
let TeamService = class TeamService {
    constructor(teamRepository, playerRepository, dataSource, configService) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.dataSource = dataSource;
        this.configService = configService;
    }
    async createTeam(createTeamMessage) {
        const { userId, teamName } = createTeamMessage;
        try {
            const team = this.teamRepository.create({
                userId,
                name: teamName,
                budget: this.configService.get("initialBudget") || 5000000,
                status: "creating",
            });
            const savedTeam = await this.teamRepository.save(team);
            await this.generatePlayersForTeam(savedTeam.id);
            savedTeam.status = "ready";
            await this.teamRepository.save(savedTeam);
            console.log(`Team created successfully for user ${userId}`);
        }
        catch (error) {
            console.error("Error creating team:", error);
            const team = await this.teamRepository.findOne({ where: { userId } });
            if (team) {
                team.status = "error";
                await this.teamRepository.save(team);
            }
        }
    }
    async generatePlayersForTeam(teamId) {
        const counts = this.configService.get("positionCounts") || { GK: 3, DEF: 6, MID: 6, ATT: 5 };
        const players = [];
        for (const [position, count] of Object.entries(counts)) {
            for (let i = 0; i < count; i++) {
                const age = this.randInt(16, 40);
                const pace = this.randInt(40, 100);
                const shooting = this.randInt(40, 100);
                const passing = this.randInt(40, 100);
                const dribbling = this.randInt(40, 100);
                const defending = this.randInt(40, 100);
                const physical = this.randInt(40, 100);
                const overall = this.computeOverall({
                    pace,
                    shooting,
                    passing,
                    dribbling,
                    defending,
                    physical,
                });
                const marketValue = this.computeMarketValue(overall, age);
                const p = this.playerRepository.create({
                    first_name: this.randomFirstName(),
                    last_name: this.randomLastName(),
                    position: position,
                    age,
                    pace,
                    shooting,
                    passing,
                    dribbling,
                    defending,
                    physical,
                    overall_rating: overall,
                    market_value: marketValue.toFixed(2),
                    teamId,
                    isOnTransferList: false,
                    askingPrice: undefined,
                });
                players.push(p);
            }
        }
        await this.playerRepository.save(players);
    }
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    computeOverall(skills) {
        const weights = {
            pace: 0.15,
            shooting: 0.2,
            passing: 0.2,
            dribbling: 0.2,
            defending: 0.15,
            physical: 0.1,
        };
        const sum = Math.round(skills.pace * weights.pace +
            skills.shooting * weights.shooting +
            skills.passing * weights.passing +
            skills.dribbling * weights.dribbling +
            skills.defending * weights.defending +
            skills.physical * weights.physical);
        return Math.max(1, Math.min(100, sum));
    }
    computeMarketValue(overall, age) {
        const base = overall * 100000;
        const peakAge = 27;
        const ageFactor = 1 - Math.abs(age - peakAge) / 20;
        const factor = 0.6 + Math.max(0, ageFactor);
        return Math.round(base * factor);
    }
    randomFirstName() {
        const names = [
            "Alex",
            "Sam",
            "Leo",
            "Max",
            "Kai",
            "Ben",
            "Liam",
            "Noah",
            "Aiden",
            "Evan",
        ];
        return names[this.randInt(0, names.length - 1)];
    }
    randomLastName() {
        const names = [
            "Smith",
            "Johnson",
            "Brown",
            "Davis",
            "Miller",
            "Wilson",
            "Taylor",
            "Anderson",
            "Thomas",
            "Jackson",
        ];
        return names[this.randInt(0, names.length - 1)];
    }
    async improvePlayerSkill(userId, playerId, skill, amount) {
        const player = await this.playerRepository.findOne({
            where: { id: playerId },
            relations: ["team"],
        });
        if (!player)
            throw new common_1.NotFoundException("Player not found");
        if (player.team.userId !== userId)
            throw new common_1.ConflictException("You can only improve skills of your own players");
        const today = new Date();
        const yyyyMmDd = today.toISOString().slice(0, 10);
        const improvementRepo = this.dataSource.getRepository(player_skill_improvement_entity_1.PlayerSkillImprovement);
        const existing = await improvementRepo.findOne({
            where: { playerId, skill, improvementDate: yyyyMmDd },
        });
        if (existing)
            throw new common_1.ConflictException("Daily skill improvement already used for this skill");
        const current = player[skill];
        const next = current + amount;
        if (amount <= 0)
            throw new common_1.ConflictException("Improvement amount must be positive");
        if (next < 1 || next > 100)
            throw new common_1.ConflictException("Resulting skill value must be within 1-100");
        player[skill] = next;
        player.overall_rating = this.computeOverall({
            pace: player.pace,
            shooting: player.shooting,
            passing: player.passing,
            dribbling: player.dribbling,
            defending: player.defending,
            physical: player.physical,
        });
        const mv = this.computeMarketValue(player.overall_rating, player.age);
        player.market_value = mv.toFixed(2);
        await this.playerRepository.save(player);
        await improvementRepo.save(improvementRepo.create({
            playerId,
            skill,
            improvementDate: yyyyMmDd,
        }));
        return player;
    }
    async getTeamByUserId(userId) {
        const team = await this.teamRepository.findOne({
            where: { userId },
            relations: ["players"],
        });
        if (!team) {
            throw new common_1.NotFoundException("Team not found");
        }
        return team;
    }
    async updateTeamBudget(teamId, amount) {
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new common_1.NotFoundException("Team not found");
        }
        team.budget += amount;
        await this.teamRepository.save(team);
    }
    async validateTeamSize(teamId) {
        const playerCount = await this.playerRepository.count({
            where: { teamId },
        });
        return playerCount >= 15 && playerCount <= 25;
    }
    async getTeamBudget(teamId) {
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new common_1.NotFoundException("Team not found");
        }
        return team.budget;
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        config_1.ConfigService])
], TeamService);
//# sourceMappingURL=team.service.js.map