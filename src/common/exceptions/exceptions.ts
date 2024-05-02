/**
 * Represents a custom exception that is thrown when a client request is malformed or invalid.
 * Extends the HttpException class from the '@nestjs/microservices' module.
 */
import { RpcException } from '@nestjs/microservices';
import {GrpcAbortedException} from 'nestjs-grpc-exceptions';

class GrpcItemNotFoundException extends GrpcAbortedException {
    constructor(itemName: string) {
        super(`${itemName}`);
        this.message = JSON.stringify({
            error: this.message,
            type: 'string',
            exceptionName: 'RpcException',
        });
    }
}

class GrpcItemExitException extends GrpcAbortedException {
    constructor(itemName: string) {
        super(`${itemName}`);
        this.message = JSON.stringify({
            error: this.message,
            type: 'string',
            exceptionName: 'RpcException',
        });
    }
}

class GrpcInvalidArgumentException extends GrpcAbortedException {
    constructor(error: string | object) {
        super(`${error}`);
        this.message = JSON.stringify({
            error: this.message,
            type: 'string',
            exceptionName: 'RpcException',
        });
    }
}

export { GrpcItemNotFoundException, GrpcItemExitException, GrpcInvalidArgumentException };
