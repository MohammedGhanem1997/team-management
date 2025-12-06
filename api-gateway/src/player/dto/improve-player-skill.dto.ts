import { IsEnum, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ImprovePlayerSkillDto {
  @ApiProperty({ enum: ["pace", "shooting", "passing", "dribbling", "defending", "physical"] })
  @IsEnum(["pace", "shooting", "passing", "dribbling", "defending", "physical"] as const)
  skill: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical";

  @ApiProperty({ minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  amount: number;
}

