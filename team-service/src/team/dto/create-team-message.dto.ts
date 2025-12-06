import { IsString } from "class-validator";

export class CreateTeamMessageDto {
  @IsString()
  userId: string;

  @IsString()
  teamName: string;
}
