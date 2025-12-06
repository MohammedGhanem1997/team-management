import { TeamService } from "./team.service";
import { ImprovePlayerSkillDto } from "./dto/improve-player-skill.dto";
export declare class PlayerSkillController {
    private readonly teamService;
    private readonly logger;
    constructor(teamService: TeamService);
    improveSkillHttp(playerId: string, body: ImprovePlayerSkillDto): Promise<import("./entities/player.entity").Player>;
    improveSkillMessage(data: {
        userId: string;
        playerId: string;
        skill: ImprovePlayerSkillDto["skill"];
        amount: number;
    }): Promise<import("./entities/player.entity").Player>;
}
