"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_helper_1 = require("../../src/common/errors/error.helper");
const common_1 = require("@nestjs/common");
describe('Auth Error Helper', () => {
    it('maps conflict on register', () => {
        const err = { message: 'User already exists' };
        const ex = (0, error_helper_1.buildHttpException)(err, 'AuthCtx');
        const res = ex.getResponse();
        expect(res['statusCode']).toBe(common_1.HttpStatus.CONFLICT);
        expect(res['type']).toBe('ConflictError');
    });
    it('maps unauthorized on login', () => {
        const err = { message: 'Invalid credentials' };
        const ex = (0, error_helper_1.buildRpcException)(err, 'AuthCtx');
        const payload = ex.message;
        expect(payload['statusCode']).toBe(common_1.HttpStatus.UNAUTHORIZED);
        expect(payload['type']).toBe('UnauthorizedError');
    });
});
//# sourceMappingURL=error.helper.spec.js.map