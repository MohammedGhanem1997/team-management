import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class TransferFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  playerName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  minPrice?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  maxPrice?: number
}

