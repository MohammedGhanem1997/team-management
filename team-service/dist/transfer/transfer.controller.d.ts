import { TransferService } from "./transfer.service";
import { TransferFilterDto } from "./dto/transfer-filter.dto";
import { ListPlayerDto } from "./dto/list-player.dto";
import { BuyPlayerDto } from "./dto/buy-player.dto";
export declare class TransferController {
    private readonly transferService;
    constructor(transferService: TransferService);
    getTransfers(filters: TransferFilterDto): Promise<import("../team/entities/player.entity").Player[]>;
    listPlayer(data: {
        userId: string;
    } & ListPlayerDto): Promise<import("../team/entities/player.entity").Player>;
    removePlayerFromTransferList(data: {
        userId: string;
        playerId: string;
    }): Promise<import("../team/entities/player.entity").Player>;
    buyPlayer(data: {
        userId: string;
    } & BuyPlayerDto): Promise<void>;
}
