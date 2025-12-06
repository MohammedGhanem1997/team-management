import { IsOptional, IsString, IsInt, Min } from 'class-validator'

export class TransferFilterDto {
  @IsOptional()
  @IsString()
  teamName?: string

  @IsOptional()
  @IsString()
  playerName?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  maxPrice?: number
}

