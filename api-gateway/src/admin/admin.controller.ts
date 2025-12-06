import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'

class SetRateLimitDto {
  endpoint: string
  limit: number
}

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private config: ConfigService) {}

  @Post('rate-limit')
  async setRateLimit(@Body() dto: SetRateLimitDto) {
    if (!dto.endpoint || typeof dto.limit !== 'number') {
      throw new BadRequestException('Invalid payload')
    }
    const current = this.config.get<Record<string, number>>('rateLimit.endpointLimits') || {}
    current[dto.endpoint] = dto.limit
    ;(this.config as any).internalConfig = {
      ...((this.config as any).internalConfig || {}),
      rateLimit: { ...(this.config.get('rateLimit') || {}), endpointLimits: current },
    }
    return { success: true, endpoint: dto.endpoint, limit: dto.limit }
  }
}

