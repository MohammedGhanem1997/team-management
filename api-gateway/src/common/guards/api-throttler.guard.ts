import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'

@Injectable()
export class ApiThrottlerGuard extends ThrottlerGuard {
  constructor(options: ThrottlerModuleOptions, storage: ThrottlerStorage, reflector: Reflector, private readonly config: ConfigService) {
    super(options, storage, reflector)
  }

  protected getTracker(req: Record<string, any>): string {
    const apiKey = req.headers['x-api-key'] as string
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip
    return apiKey ? `apikey:${apiKey}` : `ip:${ip}`
  }

  async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const result = await super.handleRequest(context, limit, ttl)
    const res = context.switchToHttp().getResponse()
    try {
      res.setHeader('X-RateLimit-Limit', String(limit))
      const reset = Math.floor((Date.now() + ttl * 1000) / 1000)
      res.setHeader('X-RateLimit-Reset', String(reset))
    } catch {}
    return result
  }
}
