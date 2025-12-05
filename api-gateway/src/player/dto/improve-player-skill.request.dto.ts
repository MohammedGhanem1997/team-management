import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsEnum, IsInt, Min, Max } from "class-validator";

export class ImprovePlayerSkillRequestDto {
  @ApiProperty({ description: "Player identifier", format: "uuid" })
  @IsUUID()
  player_id: string;

  @ApiProperty({ enum: ["pace", "shooting", "passing", "dribbling", "defending", "physical"], description: "Which skill to improve" })
  @IsEnum(["pace", "shooting", "passing", "dribbling", "defending", "physical"] as const)
  improvement_type: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical";

  @ApiProperty({ minimum: 1, maximum: 10, description: "Improvement amount (1-10)" })
  @IsInt()
  @Min(1)
  @Max(10)
  value: number;
}

