import { ClientProxy } from "@nestjs/microservices";
import { ImprovePlayerSkillDto } from "./dto/improve-player-skill.dto";
import { ImprovePlayerSkillRequestDto } from "./dto/improve-player-skill.request.dto";
import { ImprovePlayerSkillResponseDto } from "./dto/improve-player-skill.response.dto";
export declare class PlayerController {
    private readonly teamServiceClient;
    private readonly logger;
    constructor(teamServiceClient: ClientProxy);
    improveSkill(playerId: string, body: ImprovePlayerSkillDto): Promise<any>;
    improveSkillV1(reqBody: ImprovePlayerSkillRequestDto): Promise<ImprovePlayerSkillResponseDto>;
}
