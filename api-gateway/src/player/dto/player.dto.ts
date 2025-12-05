import { ApiProperty } from "@nestjs/swagger";

export class PlayerDto {
  @ApiProperty() id: string;
  @ApiProperty() first_name: string;
  @ApiProperty() last_name: string;
  @ApiProperty({ enum: ["GK", "DEF", "MID", "ATT"] }) position: "GK" | "DEF" | "MID" | "ATT";
  @ApiProperty() age: number;
  @ApiProperty() overall_rating: number;
  @ApiProperty() pace: number;
  @ApiProperty() shooting: number;
  @ApiProperty() passing: number;
  @ApiProperty() dribbling: number;
  @ApiProperty() defending: number;
  @ApiProperty() physical: number;
  @ApiProperty() market_value: string;
  @ApiProperty({ required: false }) teamId?: string;
}

