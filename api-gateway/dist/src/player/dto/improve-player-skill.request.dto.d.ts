export declare class ImprovePlayerSkillRequestDto {
    player_id: string;
    improvement_type: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical";
    value: number;
}
