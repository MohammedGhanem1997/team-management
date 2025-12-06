import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../src/app.module'

describe('Auth E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('register -> token present', async () => {
    const server = app.getHttpServer()
    const res = await request(server)
      .post('/auth/register')
      .send({ email: `test_${Date.now()}@example.com`, password: 'SecurePass123!' })
      .expect(201)
    expect(res.body.access_token).toBeDefined()
  })

  it('login -> 200', async () => {
    const server = app.getHttpServer()
    const email = `login_${Date.now()}@example.com`
    await request(server).post('/auth/register').send({ email, password: 'SecurePass123!' }).expect(201)
    const res = await request(server).post('/auth/login').send({ email, password: 'SecurePass123!' }).expect(200)
    expect(res.body.access_token).toBeDefined()
  })
})

