import { ApiProperty } from "@nestjs/swagger";
import { PlayerDto } from "./player.dto";

export class ImprovePlayerSkillResponseDto {
  @ApiProperty({ description: "Operation success status" })
  success: boolean;

  @ApiProperty({ type: PlayerDto })
  updated_player_data: PlayerDto;
}

