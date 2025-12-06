"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autocannon_1 = require("autocannon");
describe('Performance', () => {
    it('baseline /transfers throughput', async () => {
        const result = await (0, autocannon_1.default)({ url: 'http://localhost:3000/transfers', connections: 10, duration: 5 });
        expect(result.latency.p50).toBeDefined();
        expect(result.latency.p90).toBeDefined();
        expect(result.latency.p99).toBeDefined();
    });
});
//# sourceMappingURL=perf.test.js.map