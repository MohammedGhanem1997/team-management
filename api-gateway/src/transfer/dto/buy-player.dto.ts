import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BuyPlayerDto {
  @ApiProperty({ example: 'uuid' })
  @IsString()
  playerId: string
}

