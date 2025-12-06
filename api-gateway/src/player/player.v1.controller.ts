import { Controller, Post, Body, Inject, UseGuards, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout, catchError } from "rxjs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Throttle } from "@nestjs/throttler";
import { ImprovePlayerSkillRequestDto } from "./dto/improve-player-skill.request.dto";
import { ImprovePlayerSkillResponseDto } from "./dto/improve-player-skill.response.dto";

@ApiTags("Players")
@ApiBearerAuth("JWT")
@Controller("api/v1/players")
export class PlayerV1Controller {
  private readonly logger = new Logger(PlayerV1Controller.name);

  constructor(
    @Inject("TEAM_SERVICE") private readonly teamServiceClient: ClientProxy
  ) {}

  @Post("improve")
  @Throttle(20, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Improve player skill (v1)" })
  @ApiBody({ type: ImprovePlayerSkillRequestDto })
  @ApiResponse({ status: 200, description: "Skill improved", type: ImprovePlayerSkillResponseDto })
  @ApiResponse({ status: 400, description: "Invalid parameters (range 1-10, valid skill type)" })
  @ApiResponse({ status: 404, description: "Player not found or not owned by user" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async improveSkillV1(@Body() reqBody: ImprovePlayerSkillRequestDto) {
    const userId = "gateway-user-context";
    this.logger.log(
      `Gateway v1 improve skill ${reqBody.improvement_type} by ${reqBody.value} for player ${reqBody.player_id}`
    );
    const obs = this.teamServiceClient
      .send("improve_player_skill", {
        userId,
        playerId: reqBody.player_id,
        skill: reqBody.improvement_type,
        amount: reqBody.value,
      })
      .pipe(
        timeout(5000),
        catchError((err) => {
          this.logger.error(`Circuit breaker tripped: ${err?.message || err}`);
          throw err;
        })
      );
    const updated = await firstValueFrom(obs);
    const resp: ImprovePlayerSkillResponseDto = {
      success: true,
      updated_player_data: updated,
    };
    return resp;
  }
}

