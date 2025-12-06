import { BaseEntityCommon } from "../../common/base.entity";
import { Player } from "./player.entity";
export declare class PlayerSkillImprovement extends BaseEntityCommon {
    id: string;
    playerId: string;
    player: Player;
    skill: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical";
    improvementDate: string;
}
