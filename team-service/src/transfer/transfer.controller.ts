import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TransferService } from "./transfer.service";
import { TransferFilterDto } from "./dto/transfer-filter.dto";
import { ListPlayerDto } from "./dto/list-player.dto";
import { BuyPlayerDto } from "./dto/buy-player.dto";

@Controller("transfers")
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @MessagePattern("get_transfers")
  async getTransfers(@Payload() filters: TransferFilterDto) {
    return this.transferService.getTransfers(filters);
  }

  @MessagePattern("list_player")
  async listPlayer(@Payload() data: { userId: string } & ListPlayerDto) {
    return this.transferService.listPlayer(data.userId, data);
  }

  @MessagePattern("remove_player_from_transfer")
  async removePlayerFromTransferList(
    @Payload() data: { userId: string; playerId: string }
  ) {
    return this.transferService.removePlayerFromTransferList(
      data.userId,
      data.playerId
    );
  }

  @MessagePattern("buy_player")
  async buyPlayer(@Payload() data: { userId: string } & BuyPlayerDto) {
    return this.transferService.buyPlayer(data.userId, data);
  }
}
