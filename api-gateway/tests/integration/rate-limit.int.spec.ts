import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../src/app.module'

describe('Rate Limiting (Integration)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should allow requests under limit', async () => {
    const server = app.getHttpServer()
    const res = await request(server).get('/transfers').expect(200)
    expect(res.headers['x-ratelimit-limit']).toBeDefined()
    expect(res.headers['x-ratelimit-remaining']).toBeDefined()
  })

  it('should return 429 when exceeding IP limit', async () => {
    const server = app.getHttpServer()
    // Rapidly hit endpoint beyond configured limit for test
    const promises = []
    for (let i = 0; i < 120; i++) promises.push(request(server).get('/transfers'))
    const results = await Promise.all(promises)
    const tooMany = results.find(r => r.status === 429)
    expect(tooMany).toBeTruthy()
    if (tooMany) {
      expect(tooMany.body.error).toBe('rate_limit_exceeded')
      expect(tooMany.headers['x-ratelimit-limit']).toBeDefined()
      expect(tooMany.headers['x-ratelimit-reset']).toBeDefined()
    }
  })
})

