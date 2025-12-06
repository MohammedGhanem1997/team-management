export declare class PlayerDto {
    id: string;
    first_name: string;
    last_name: string;
    position: "GK" | "DEF" | "MID" | "ATT";
    age: number;
    overall_rating: number;
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    market_value: string;
    teamId?: string;
}
