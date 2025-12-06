"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHttpException = buildHttpException;
exports.wrapAsync = wrapAsync;
const common_1 = require("@nestjs/common");
function detectStatus(err) {
    const code = err?.status || err?.response?.statusCode;
    if (typeof code === 'number')
        return code;
    const msg = (err?.message || err?.response?.message || '').toString().toLowerCase();
    if (msg.includes('not found'))
        return common_1.HttpStatus.NOT_FOUND;
    if (msg.includes('unauthorized'))
        return common_1.HttpStatus.UNAUTHORIZED;
    if (msg.includes('forbidden'))
        return common_1.HttpStatus.FORBIDDEN;
    if (msg.includes('already') || msg.includes('conflict') || msg.includes('not on transfer list'))
        return common_1.HttpStatus.CONFLICT;
    if (msg.includes('validation') || msg.includes('invalid') || msg.includes('bad request'))
        return common_1.HttpStatus.BAD_REQUEST;
    return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
}
function detectType(status) {
    switch (status) {
        case common_1.HttpStatus.BAD_REQUEST:
            return 'ValidationError';
        case common_1.HttpStatus.NOT_FOUND:
            return 'NotFoundError';
        case common_1.HttpStatus.CONFLICT:
            return 'ConflictError';
        case common_1.HttpStatus.UNAUTHORIZED:
            return 'UnauthorizedError';
        case common_1.HttpStatus.FORBIDDEN:
            return 'ForbiddenError';
        default:
            return 'InternalError';
    }
}
function buildHttpException(err, context, override) {
    const logger = new common_1.Logger(context);
    const status = override?.status ?? detectStatus(err);
    const type = override?.type ?? detectType(status);
    const message = override?.message ?? (err?.message || err?.response?.message || 'Internal server error');
    const isDev = (process.env.NODE_ENV || 'development') !== 'production';
    const body = {
        statusCode: status,
        message,
        type,
        timestamp: new Date().toISOString(),
    };
    if (isDev) {
        body.debug = {
            cause: override?.cause ?? err?.response ?? undefined,
            stack: err?.stack ?? undefined,
        };
    }
    if (status >= 500)
        logger.error(message, err?.stack);
    else
        logger.warn(message);
    return new common_1.HttpException(body, status, { cause: override?.cause ?? err });
}
async function wrapAsync(fn, context) {
    try {
        return await fn();
    }
    catch (err) {
        throw buildHttpException(err, context);
    }
}
//# sourceMappingURL=error.helper.js.map