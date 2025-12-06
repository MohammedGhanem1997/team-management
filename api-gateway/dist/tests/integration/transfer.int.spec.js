"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../src/app.module");
describe('Transfer Integration', () => {
    let app;
    let token;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        const server = app.getHttpServer();
        const email = `x_${Date.now()}@example.com`;
        const reg = await (0, supertest_1.default)(server).post('/auth/register').send({ email, password: 'SecurePass123!' });
        token = reg.body.access_token;
    });
    afterAll(async () => {
        await app.close();
    });
    it('GET /transfers with auth', async () => {
        const server = app.getHttpServer();
        const res = await (0, supertest_1.default)(server)
            .get('/transfers')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
//# sourceMappingURL=transfer.int.spec.js.map