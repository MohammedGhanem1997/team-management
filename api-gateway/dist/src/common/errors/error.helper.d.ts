import { HttpException } from '@nestjs/common';
export type ErrorType = 'ValidationError' | 'NotFoundError' | 'ConflictError' | 'UnauthorizedError' | 'ForbiddenError' | 'InternalError' | string;
export interface ErrorOptions {
    message?: string;
    status?: number;
    type?: ErrorType;
    debug?: any;
    cause?: any;
}
export declare function buildHttpException(err: any, context: string, override?: ErrorOptions): HttpException;
export declare function wrapAsync<T>(fn: () => Promise<T>, context: string): Promise<T>;
