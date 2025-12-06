import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
export type ErrorType = 'ValidationError' | 'NotFoundError' | 'ConflictError' | 'UnauthorizedError' | 'ForbiddenError' | 'InternalError' | string;
export interface ErrorOptions {
    message?: string;
    status?: number;
    type?: ErrorType;
    debug?: any;
    cause?: any;
}
export declare function buildHttpException(err: any, context: string, override?: ErrorOptions): HttpException;
export declare function buildRpcException(err: any, context: string, override?: ErrorOptions): RpcException;
