import { Repository, DataSource } from "typeorm";
import { Team } from "./entities/team.entity";
import { Player } from "./entities/player.entity";
import { CreateTeamMessageDto } from "./dto/create-team-message.dto";
import { ConfigService } from "@nestjs/config";
export declare const POSITION_COUNTS: {};
export declare class TeamService {
    private teamRepository;
    private playerRepository;
    private readonly dataSource;
    private readonly configService;
    constructor(teamRepository: Repository<Team>, playerRepository: Repository<Player>, dataSource: DataSource, configService: ConfigService);
    createTeam(createTeamMessage: CreateTeamMessageDto): Promise<void>;
    private generatePlayersForTeam;
    private randInt;
    private computeOverall;
    private computeMarketValue;
    private randomFirstName;
    private randomLastName;
    improvePlayerSkill(userId: string, playerId: string, skill: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical", amount: number): Promise<Player>;
    getTeamByUserId(userId: string): Promise<Team>;
    updateTeamBudget(teamId: string, amount: number): Promise<void>;
    validateTeamSize(teamId: string): Promise<boolean>;
    getTeamBudget(teamId: string): Promise<number>;
}
