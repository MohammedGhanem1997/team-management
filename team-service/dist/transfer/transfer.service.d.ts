import { Repository } from "typeorm";
import { Team } from "../team/entities/team.entity";
import { Player } from "../team/entities/player.entity";
import { ConfigService } from "@nestjs/config";
import { TransferFilterDto } from "./dto/transfer-filter.dto";
import { ListPlayerDto } from "./dto/list-player.dto";
import { BuyPlayerDto } from "./dto/buy-player.dto";
export declare class TransferService {
    private teamRepository;
    private playerRepository;
    private readonly configService;
    constructor(teamRepository: Repository<Team>, playerRepository: Repository<Player>, configService: ConfigService);
    getTransfers(filters: TransferFilterDto): Promise<Player[]>;
    listPlayer(userId: string, listPlayerDto: ListPlayerDto): Promise<Player>;
    removePlayerFromTransferList(userId: string, playerId: string): Promise<Player>;
    buyPlayer(userId: string, buyPlayerDto: BuyPlayerDto): Promise<void>;
    getPlayerById(playerId: string): Promise<Player>;
}
