import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus, ValidationError } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseBase } from './response.dto';
import { Error as MongooseValidationError } from 'mongoose';
// import { ValidationError } from "mongoose";

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof InvalidRequestException) {
            // Handle custom type errors
            const status = exception.getStatus();
            response.status(status).json(ResponseBase.failed(...exception.errors));

        }
        else if (exception instanceof NotFoundException) {
            // Handle custom type errors
            const status = exception.getStatus();
            response.status(status).json(ResponseBase.failed(...exception.message));

        }
        else if (exception instanceof MongooseValidationError) {
            response.status(HttpStatus.BAD_REQUEST).json(ResponseBase.failed(exception.message));
        }
        else {
            console.error(exception);
            response.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}

export class InvalidRequestException extends HttpException {
    errors: string[];
    constructor(message: string, errors: ValidationError[]) {
        super(message, HttpStatus.BAD_REQUEST);
        this.errors = errors.map(e => `${e.property}: ${JSON.stringify(e.constraints)}`);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
