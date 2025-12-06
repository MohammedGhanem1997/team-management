import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TeamService } from "./team.service";
import { CreateTeamMessageDto } from "./dto/create-team-message.dto";

@Controller()
export class TeamConsumer {
  constructor(private readonly teamService: TeamService) {}

  @EventPattern("create_team")
  async handleCreateTeam(@Payload() data: CreateTeamMessageDto) {
    console.log("Received create_team event:", data);
    await this.teamService.createTeam(data);
  }
}
