"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../src/app.module");
describe('Auth E2E', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('register -> token present', async () => {
        const server = app.getHttpServer();
        const res = await (0, supertest_1.default)(server)
            .post('/auth/register')
            .send({ email: `test_${Date.now()}@example.com`, password: 'SecurePass123!' })
            .expect(201);
        expect(res.body.access_token).toBeDefined();
    });
    it('login -> 200', async () => {
        const server = app.getHttpServer();
        const email = `login_${Date.now()}@example.com`;
        await (0, supertest_1.default)(server).post('/auth/register').send({ email, password: 'SecurePass123!' }).expect(201);
        const res = await (0, supertest_1.default)(server).post('/auth/login').send({ email, password: 'SecurePass123!' }).expect(200);
        expect(res.body.access_token).toBeDefined();
    });
});
//# sourceMappingURL=auth.e2e.spec.js.map