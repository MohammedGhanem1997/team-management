import { Team } from "./team.entity";
import { BaseEntityCommon } from "../../common/base.entity";
export declare class Player extends BaseEntityCommon {
    id: string;
    first_name: string;
    last_name: string;
    position: "GK" | "DEF" | "MID" | "ATT";
    age: number;
    market_value: string;
    overall_rating: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    teamId?: string;
    team?: Team;
    isOnTransferList: boolean;
    askingPrice?: number;
}
