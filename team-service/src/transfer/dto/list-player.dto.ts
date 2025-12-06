import { IsString, IsInt, Min } from 'class-validator'

export class ListPlayerDto {
  @IsString()
  playerId: string

  @IsInt()
  @Min(1)
  askingPrice: number
}

