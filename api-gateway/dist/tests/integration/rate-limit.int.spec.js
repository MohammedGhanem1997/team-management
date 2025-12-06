"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../src/app.module");
describe('Rate Limiting (Integration)', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('should allow requests under limit', async () => {
        const server = app.getHttpServer();
        const res = await (0, supertest_1.default)(server).get('/transfers').expect(200);
        expect(res.headers['x-ratelimit-limit']).toBeDefined();
        expect(res.headers['x-ratelimit-remaining']).toBeDefined();
    });
    it('should return 429 when exceeding IP limit', async () => {
        const server = app.getHttpServer();
        const promises = [];
        for (let i = 0; i < 120; i++)
            promises.push((0, supertest_1.default)(server).get('/transfers'));
        const results = await Promise.all(promises);
        const tooMany = results.find(r => r.status === 429);
        expect(tooMany).toBeTruthy();
        if (tooMany) {
            expect(tooMany.body.error).toBe('rate_limit_exceeded');
            expect(tooMany.headers['x-ratelimit-limit']).toBeDefined();
            expect(tooMany.headers['x-ratelimit-reset']).toBeDefined();
        }
    });
});
//# sourceMappingURL=rate-limit.int.spec.js.map