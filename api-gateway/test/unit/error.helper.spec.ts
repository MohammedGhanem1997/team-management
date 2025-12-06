import { buildHttpException } from '../../src/common/errors/error.helper'
import { HttpStatus } from '@nestjs/common'

describe('Error Helper', () => {
  it('maps not found message to 404', () => {
    const err = { message: 'Player not found' }
    const ex = buildHttpException(err, 'TestCtx')
    const res: any = ex.getResponse()
    expect(res['statusCode']).toBe(HttpStatus.NOT_FOUND)
    expect(res['type']).toBe('NotFoundError')
  })

  it('maps conflict message to 409', () => {
    const err = { message: 'Player is not on transfer list' }
    const ex = buildHttpException(err, 'TestCtx')
    const res: any = ex.getResponse()
    expect(res['statusCode']).toBe(HttpStatus.CONFLICT)
    expect(res['type']).toBe('ConflictError')
  })

  it('uses override values when provided', () => {
    const err = { message: 'anything' }
    const ex = buildHttpException(err, 'TestCtx', { status: HttpStatus.BAD_REQUEST, type: 'ValidationError', message: 'Invalid data' })
    const res: any = ex.getResponse()
    expect(res['statusCode']).toBe(HttpStatus.BAD_REQUEST)
    expect(res['type']).toBe('ValidationError')
    expect(res['message']).toBe('Invalid data')
  })
})

