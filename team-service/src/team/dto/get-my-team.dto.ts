import { IsString } from "class-validator";

export class GetMyTeamDto {
  @IsString()
  userId: string;
}
