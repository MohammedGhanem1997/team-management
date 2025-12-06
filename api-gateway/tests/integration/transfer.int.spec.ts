import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../src/app.module'

describe('Transfer Integration', () => {
  let app: INestApplication
  let token: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    await app.init()

    const server = app.getHttpServer()
    const email = `x_${Date.now()}@example.com`
    const reg = await request(server).post('/auth/register').send({ email, password: 'SecurePass123!' })
    token = reg.body.access_token
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /transfers with auth', async () => {
    const server = app.getHttpServer()
    const res = await request(server)
      .get('/transfers')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(Array.isArray(res.body)).toBeTruthy()
  })
})

