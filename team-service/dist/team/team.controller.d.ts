import { TeamService } from "./team.service";
import { GetMyTeamDto } from "./dto/get-my-team.dto";
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    getMyTeam(data: GetMyTeamDto): Promise<import("./entities/team.entity").Team>;
}
