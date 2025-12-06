import { Player } from "./player.entity";
import { BaseEntityCommon } from "../../common/base.entity";
export declare class Team extends BaseEntityCommon {
    userId: string;
    name: string;
    budget: number;
    status: "creating" | "ready" | "error";
    players: Player[];
}
