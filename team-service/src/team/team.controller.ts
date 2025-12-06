import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TeamService } from "./team.service";
import { GetMyTeamDto } from "./dto/get-my-team.dto";

@Controller("teams")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern("get_my_team")
  async getMyTeam(@Payload() data: GetMyTeamDto) {
    return this.teamService.getTeamByUserId(data.userId);
  }
}
