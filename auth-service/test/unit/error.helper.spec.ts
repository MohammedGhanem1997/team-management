import { buildHttpException, buildRpcException } from '../../src/common/errors/error.helper'
import { HttpStatus } from '@nestjs/common'

describe('Auth Error Helper', () => {
  it('maps conflict on register', () => {
    const err = { message: 'User already exists' }
    const ex = buildHttpException(err, 'AuthCtx')
    const res: any = ex.getResponse()
    expect(res['statusCode']).toBe(HttpStatus.CONFLICT)
    expect(res['type']).toBe('ConflictError')
  })

  it('maps unauthorized on login', () => {
    const err = { message: 'Invalid credentials' }
    const ex = buildRpcException(err, 'AuthCtx')
    // RpcException payload retrieval via toString is not standard; simulate mapping
    const payload: any = (ex as any).message
    expect(payload['statusCode']).toBe(HttpStatus.UNAUTHORIZED)
    expect(payload['type']).toBe('UnauthorizedError')
  })
})

