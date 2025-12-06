import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Inject,
  UseGuards,
} from "@nestjs/common";
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
import { TransferFilterDto } from "./dto/transfer-filter.dto";
import { ListPlayerDto } from "./dto/list-player.dto";
import { BuyPlayerDto } from "./dto/buy-player.dto";

@ApiTags("Transfer Market")
@ApiBearerAuth("JWT")
@Controller("transfers")
export class TransferController {
  constructor(
    @Inject("TEAM_SERVICE")
    private readonly teamServiceClient: ClientProxy
  ) {}

  @Get()
  @Throttle(60, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get available transfers" })
  @ApiResponse({ status: 200, description: "Transfers retrieved successfully" })
  async getTransfers(@Query() filters: TransferFilterDto) {
    return firstValueFrom(
      this.teamServiceClient.send("get_transfers", filters)
    );
  }

  @Post("list-player")
  @Throttle(20, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "List player on transfer market" })
  @ApiResponse({ status: 200, description: "Player listed successfully" })
  async listPlayer(@Req() req: any, @Body() listPlayerDto: ListPlayerDto) {
    return firstValueFrom(
      this.teamServiceClient.send("list_player", {
        userId: req.user.id,
        ...listPlayerDto,
      })
    );
  }

  @Post("remove-player")
  @Throttle(20, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Remove player from transfer list" })
  @ApiResponse({ status: 200, description: "Player removed successfully" })
  async removePlayerFromTransferList(
    @Req() req: any,
    @Body("playerId") playerId: string
  ) {
    return firstValueFrom(
      this.teamServiceClient.send("remove_player_from_transfer", {
        userId: req.user.id,
        playerId,
      })
    );
  }

  @Post("buy-player")
  @Throttle(20, 60)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Buy player from transfer market" })
  @ApiResponse({ status: 200, description: "Player purchased successfully" })
  async buyPlayer(@Req() req: any, @Body() buyPlayerDto: BuyPlayerDto) {
    return firstValueFrom(
      this.teamServiceClient.send("buy_player", {
        userId: req.user.id,
        ...buyPlayerDto,
      })
    );
  }
}
