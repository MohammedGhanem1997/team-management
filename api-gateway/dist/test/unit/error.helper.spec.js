"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_helper_1 = require("../../src/common/errors/error.helper");
const common_1 = require("@nestjs/common");
describe('Error Helper', () => {
    it('maps not found message to 404', () => {
        const err = { message: 'Player not found' };
        const ex = (0, error_helper_1.buildHttpException)(err, 'TestCtx');
        const res = ex.getResponse();
        expect(res['statusCode']).toBe(common_1.HttpStatus.NOT_FOUND);
        expect(res['type']).toBe('NotFoundError');
    });
    it('maps conflict message to 409', () => {
        const err = { message: 'Player is not on transfer list' };
        const ex = (0, error_helper_1.buildHttpException)(err, 'TestCtx');
        const res = ex.getResponse();
        expect(res['statusCode']).toBe(common_1.HttpStatus.CONFLICT);
        expect(res['type']).toBe('ConflictError');
    });
    it('uses override values when provided', () => {
        const err = { message: 'anything' };
        const ex = (0, error_helper_1.buildHttpException)(err, 'TestCtx', { status: common_1.HttpStatus.BAD_REQUEST, type: 'ValidationError', message: 'Invalid data' });
        const res = ex.getResponse();
        expect(res['statusCode']).toBe(common_1.HttpStatus.BAD_REQUEST);
        expect(res['type']).toBe('ValidationError');
        expect(res['message']).toBe('Invalid data');
    });
});
//# sourceMappingURL=error.helper.spec.js.map