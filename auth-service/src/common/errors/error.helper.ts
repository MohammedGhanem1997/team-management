import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

export type ErrorType =
  | 'ValidationError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'UnauthorizedError'
  | 'ForbiddenError'
  | 'InternalError'
  | string

export interface ErrorOptions {
  message?: string
  status?: number
  type?: ErrorType
  debug?: any
  cause?: any
}

function detectStatus(err: any): number {
  const code = err?.status || err?.response?.statusCode
  if (typeof code === 'number') return code
  const msg = (err?.message || err?.response?.message || '').toString().toLowerCase()
  if (msg.includes('already exists')) return HttpStatus.CONFLICT
  if (msg.includes('invalid credentials')) return HttpStatus.UNAUTHORIZED
  if (msg.includes('not found')) return HttpStatus.NOT_FOUND
  if (msg.includes('forbidden')) return HttpStatus.FORBIDDEN
  if (msg.includes('validation') || msg.includes('invalid') || msg.includes('bad request')) return HttpStatus.BAD_REQUEST
  return HttpStatus.INTERNAL_SERVER_ERROR
}

function detectType(status: number): ErrorType {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'ValidationError'
    case HttpStatus.NOT_FOUND:
      return 'NotFoundError'
    case HttpStatus.CONFLICT:
      return 'ConflictError'
    case HttpStatus.UNAUTHORIZED:
      return 'UnauthorizedError'
    case HttpStatus.FORBIDDEN:
      return 'ForbiddenError'
    default:
      return 'InternalError'
  }
}

export function buildHttpException(err: any, context: string, override?: ErrorOptions): HttpException {
  const logger = new Logger(context)
  const status = override?.status ?? detectStatus(err)
  const type = override?.type ?? detectType(status)
  const message = override?.message ?? (err?.message || err?.response?.message || 'Internal server error')
  const isDev = (process.env.NODE_ENV || 'development') !== 'production'

  const body: any = {
    statusCode: status,
    message,
    type,
    timestamp: new Date().toISOString(),
  }
  if (isDev) {
    body.debug = {
      cause: override?.cause ?? err?.response ?? undefined,
      stack: err?.stack ?? undefined,
    }
  }

  if (status >= 500) logger.error(message, err?.stack)
  else logger.warn(message)

  return new HttpException(body, status, { cause: override?.cause ?? err })
}

export function buildRpcException(err: any, context: string, override?: ErrorOptions): RpcException {
  const status = override?.status ?? detectStatus(err)
  const type = override?.type ?? detectType(status)
  const message = override?.message ?? (err?.message || err?.response?.message || 'Internal server error')
  const payload: any = {
    statusCode: status,
    message,
    type,
    timestamp: new Date().toISOString(),
  }
  if ((process.env.NODE_ENV || 'development') !== 'production') {
    payload.debug = {
      cause: override?.cause ?? err?.response ?? undefined,
      stack: err?.stack ?? undefined,
      context,
    }
  }
  return new RpcException(payload)
}

