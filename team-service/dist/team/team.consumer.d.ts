import { TeamService } from "./team.service";
import { CreateTeamMessageDto } from "./dto/create-team-message.dto";
export declare class TeamConsumer {
    private readonly teamService;
    constructor(teamService: TeamService);
    handleCreateTeam(data: CreateTeamMessageDto): Promise<void>;
}
