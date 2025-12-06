import {
  Controller,
  Post,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TeamService } from "./team.service";
import { ImprovePlayerSkillDto } from "./dto/improve-player-skill.dto";

@Controller("players")
export class PlayerSkillController {
  private readonly logger = new Logger(PlayerSkillController.name);

  constructor(private readonly teamService: TeamService) {}

  @Post(":playerId/skills")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async improveSkillHttp(
    @Param("playerId") playerId: string,
    @Body() body: ImprovePlayerSkillDto
  ) {
    this.logger.log(
      `Improving skill ${body.skill} by ${body.amount} for player ${playerId}`
    );
    const userId = "http-user-context";
    const res = await this.teamService.improvePlayerSkill(
      userId,
      playerId,
      body.skill,
      body.amount
    );
    return res;
  }

  @MessagePattern("improve_player_skill")
  async improveSkillMessage(
    @Payload()
    data: {
      userId: string;
      playerId: string;
      skill: ImprovePlayerSkillDto["skill"];
      amount: number;
    }
  ) {
    this.logger.log(
      `RMQ improve skill ${data.skill} amt ${data.amount} for player ${data.playerId} by user ${data.userId}`
    );
    return this.teamService.improvePlayerSkill(
      data.userId,
      data.playerId,
      data.skill,
      data.amount
    );
  }
}
