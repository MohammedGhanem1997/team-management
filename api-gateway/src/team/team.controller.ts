import { Controller, Get, Req, Inject, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Throttle } from "@nestjs/throttler";

@ApiTags("Team Management")
@ApiBearerAuth("JWT")
@Controller("teams")
export class TeamController {
  constructor(
    @Inject("TEAM_SERVICE")
    private readonly teamServiceClient: ClientProxy
  ) {}

  @Get("my-team")
  @Throttle(30, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get user team" })
  @ApiResponse({ status: 200, description: "Team retrieved successfully" })
  async getMyTeam(@Req() req: any) {
    return firstValueFrom(
      this.teamServiceClient.send("get_my_team", { userId: req.user.id })
    );
  }
}
