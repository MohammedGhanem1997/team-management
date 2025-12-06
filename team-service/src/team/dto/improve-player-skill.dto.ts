import { IsEnum, IsInt, Min, Max } from "class-validator";

export class ImprovePlayerSkillDto {
  @IsEnum(["pace", "shooting", "passing", "dribbling", "defending", "physical"] as const)
  skill: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical";

  @IsInt()
  @Min(1)
  @Max(10)
  amount: number;
}

