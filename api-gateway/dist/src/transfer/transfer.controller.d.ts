import { ClientProxy } from "@nestjs/microservices";
import { TransferFilterDto } from "./dto/transfer-filter.dto";
import { ListPlayerDto } from "./dto/list-player.dto";
import { BuyPlayerDto } from "./dto/buy-player.dto";
export declare class TransferController {
    private readonly teamServiceClient;
    private readonly logger;
    constructor(teamServiceClient: ClientProxy);
    getTransfers(filters: TransferFilterDto): Promise<any>;
    listPlayer(req: any, listPlayerDto: ListPlayerDto): Promise<any>;
    removePlayerFromTransferList(req: any, playerId: string): Promise<any>;
    buyPlayer(req: any, buyPlayerDto: BuyPlayerDto): Promise<any>;
}
