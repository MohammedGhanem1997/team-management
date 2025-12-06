import { IsString } from 'class-validator'

export class BuyPlayerDto {
  @IsString()
  playerId: string
}

