/**
 * Represents a custom exception that is thrown when a client request is malformed or invalid.
 * Extends the HttpException class from the '@nestjs/microservices' module.
 */
import { RpcException } from '@nestjs/microservices';

declare class GrpcItemNotFoundException extends RpcException {
    constructor(error: string | object);
}

export { GrpcItemNotFoundException };
