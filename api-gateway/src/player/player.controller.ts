import {
  Controller,
  Post,
  Param,
  Body,
  Inject,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout, catchError } from "rxjs";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Throttle } from "@nestjs/throttler";
import { ImprovePlayerSkillDto } from "./dto/improve-player-skill.dto";
import { ImprovePlayerSkillRequestDto } from "./dto/improve-player-skill.request.dto";
import { ImprovePlayerSkillResponseDto } from "./dto/improve-player-skill.response.dto";

@ApiTags("Players")
@ApiBearerAuth("JWT")
@Controller("players")
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);

  constructor(
    @Inject("TEAM_SERVICE") private readonly teamServiceClient: ClientProxy
  ) {}

  @Post(":playerId/skills")
  @Throttle(20, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Improve player skill" })
  @ApiResponse({ status: 200, description: "Skill improved" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 404, description: "Player not found" })
  @ApiResponse({ status: 503, description: "Service unavailable" })
  async improveSkill(
    @Param("playerId") playerId: string,
    @Body() body: ImprovePlayerSkillDto
    // req injected by JwtAuthGuard, typically via @Req, but kept minimal here
  ) {
    try {
      const userId = "gateway-user-context";
      this.logger.log(
        `Gateway improve skill ${body.skill} by ${body.amount} for player ${playerId}`
      );
      const obs = this.teamServiceClient
        .send("improve_player_skill", {
          userId,
          playerId,
          skill: body.skill,
          amount: body.amount,
        })
        .pipe(
          timeout(5000),
          catchError((err) => {
            this.logger.error(
              `Circuit breaker tripped: ${err?.message || err}`
            );
            throw err;
          })
        );
      return await firstValueFrom(obs);
    } catch (err) {
      const { buildHttpException } = await import(
        "../common/errors/error.helper"
      );
      throw buildHttpException(err, PlayerController.name);
    }
  }

  // OpenAPI requested endpoint: /api/v1/players/improve (served under gateway base path)
  @Post("v1/players/improve")
  @Throttle(20, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Improve player skill (v1)" })
  @ApiBody({
    type: ImprovePlayerSkillRequestDto,
    required: true,
    examples: {
      improvePace: {
        summary: "Improve pace by 3",
        value: {
          player_id: "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
          improvement_type: "pace",
          value: 3,
        },
      },
      improveShooting: {
        summary: "Improve shooting by 2",
        value: {
          player_id: "a4f8c6b1-1c2d-4e5f-9a8b-1234567890ab",
          improvement_type: "shooting",
          value: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Skill improved",
    type: ImprovePlayerSkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid parameters (range 1-10, valid skill type)",
  })
  @ApiResponse({
    status: 404,
    description: "Player not found or not owned by user",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @ApiBearerAuth("JWT")
  async improveSkillV1(@Body() reqBody: ImprovePlayerSkillRequestDto) {
    try {
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
            this.logger.error(
              `Circuit breaker tripped: ${err?.message || err}`
            );
            throw err;
          })
        );
      const updated = await firstValueFrom(obs);
      const resp: ImprovePlayerSkillResponseDto = {
        success: true,
        updated_player_data: updated,
      };
      return resp;
    } catch (err) {
      const { buildHttpException } = await import(
        "../common/errors/error.helper"
      );
      throw buildHttpException(err, PlayerController.name);
    }
  }
}
