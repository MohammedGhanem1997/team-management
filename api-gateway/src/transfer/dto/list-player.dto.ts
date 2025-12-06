import { IsString, IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListPlayerDto {
  @ApiProperty({ example: 'uuid' })
  @IsString()
  playerId: string

  @ApiProperty({ example: 1500000 })
  @IsInt()
  @Min(1)
  askingPrice: number
}

