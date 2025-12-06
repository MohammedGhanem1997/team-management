import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(private jwt: JwtService, private config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const auth = req.headers['authorization'] || ''
    this.logger.log(`Auth attempt: ${req.method} ${req.url}`)

    if (!auth || !auth.startsWith('Bearer ')) {
      this.logger.warn('Missing or malformed Authorization header')
      throw new UnauthorizedException('Authorization header missing')
    }

    const token = auth.substring('Bearer '.length)
    const secret = this.config.get<string>('JWT_SECRET')
    if (!secret) {
      this.logger.error('JWT_SECRET is not configured')
      throw new ForbiddenException('Server configuration error')
    }

    try {
      const payload = await this.jwt.verifyAsync(token, { secret })
      req.user = { id: payload.sub, email: payload.email }
      this.logger.log(`Auth success for user ${payload.sub}`)
      return true
    } catch (e) {
      this.logger.warn(`Invalid token: ${e?.message || e}`)
      throw new UnauthorizedException('Invalid token')
    }
  }
}

