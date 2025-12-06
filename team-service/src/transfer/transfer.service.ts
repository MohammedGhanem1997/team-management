import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like } from "typeorm";
import { Team } from "../team/entities/team.entity";
import { Player } from "../team/entities/player.entity";
// TeamService dependency removed; use repositories directly
import { ConfigService } from "@nestjs/config";

const TRANSFER_DISCOUNT = 0.95;
const MIN_TEAM_SIZE = 15;
const MAX_TEAM_SIZE = 25;

import { TransferFilterDto } from "./dto/transfer-filter.dto";
import { ListPlayerDto } from "./dto/list-player.dto";
import { BuyPlayerDto } from "./dto/buy-player.dto";

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private readonly configService: ConfigService
  ) {}

  async getTransfers(filters: TransferFilterDto): Promise<Player[]> {
    const query: any = {
      where: { isOnTransferList: true },
      relations: ["team"],
    };

    if (filters.playerName) {
      query.where = [
        { isOnTransferList: true, first_name: Like(`%${filters.playerName}%`) },
        { isOnTransferList: true, last_name: Like(`%${filters.playerName}%`) },
      ];
    }

    if (filters.teamName && filters.teamName !== "") {
      query.relations = ["team"];
      query.where.team = { name: Like(`%${filters.teamName}%`) };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.where.askingPrice = Between(
        filters.minPrice || 0,
        filters.maxPrice || 999999999
      );
    }

    return this.playerRepository.find(query);
  }

  async listPlayer(
    userId: string,
    listPlayerDto: ListPlayerDto
  ): Promise<Player> {
    const { playerId, askingPrice } = listPlayerDto;

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ["team"],
    });

    if (!player) {
      throw new NotFoundException("Player not found");
    }

    if (player.team.userId !== userId) {
      throw new ConflictException(
        "You can only list players from your own team"
      );
    }

    if (player.isOnTransferList) {
      throw new ConflictException("Player is already on transfer list");
    }

    player.isOnTransferList = true;
    player.askingPrice = askingPrice;

    return this.playerRepository.save(player);
  }

  async removePlayerFromTransferList(
    userId: string,
    playerId: string
  ): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ["team"],
    });

    if (!player) {
      throw new NotFoundException("Player not found");
    }

    if (player.team.userId !== userId) {
      throw new ConflictException(
        "You can only remove players from your own team"
      );
    }

    if (!player.isOnTransferList) {
      throw new ConflictException("Player is not on transfer list");
    }

    player.isOnTransferList = false;
    player.askingPrice = undefined;

    return this.playerRepository.save(player);
  }

  async buyPlayer(userId: string, buyPlayerDto: BuyPlayerDto): Promise<void> {
    const { playerId } = buyPlayerDto;

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ["team"],
    });

    if (!player) {
      throw new NotFoundException("Player not found");
    }

    if (!player.isOnTransferList) {
      throw new ConflictException("Player is not on transfer list");
    }

    if (player.team.userId === userId) {
      throw new ConflictException("You cannot buy your own player");
    }

    const buyerTeam = await this.teamRepository.findOne({ where: { userId } });
    if (!buyerTeam) {
      throw new NotFoundException("Buyer team not found");
    }

    const sellerTeam = player.team;

    const discount =
      this.configService.get<number>("transferDiscount") ?? TRANSFER_DISCOUNT;
    const purchasePrice = Math.floor(player.askingPrice! * discount);

    if (buyerTeam.budget < purchasePrice) {
      throw new ConflictException("Insufficient budget");
    }

    const currentTeamSize = await this.playerRepository.count({
      where: { teamId: buyerTeam.id },
    });
    if (currentTeamSize >= MAX_TEAM_SIZE) {
      throw new ConflictException(
        `Team cannot have more than ${MAX_TEAM_SIZE} players`
      );
    }

    buyerTeam.budget -= purchasePrice;
    sellerTeam.budget += purchasePrice;
    await this.teamRepository.save([buyerTeam, sellerTeam]);

    player.teamId = buyerTeam.id;
    player.isOnTransferList = false;
    player.askingPrice = undefined;

    await this.playerRepository.save(player);
  }

  async getPlayerById(playerId: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ["team"],
    });

    if (!player) {
      throw new NotFoundException("Player not found");
    }

    return player;
  }
}
