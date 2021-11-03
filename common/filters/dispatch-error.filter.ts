
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { MessageCodeError } from '../errors/error.module';

@Catch()
export class DispatchError implements ExceptionFilter {
    public catch(err: any, host: ArgumentsHost) {
        let response = host.switchToHttp().getResponse();
        if (err && err.code && err.code === 11000) {
            /* Mongo Dupe Index Error */
            let customError = null;
            customError = err.errmsg && err.errmsg.split('index:');
            if (customError[1]) {
                customError = customError[1].split('_');
                if (customError[0]) customError = customError[0].trim();
                else customError = false;
            } else customError = false;
            return response.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: 'An entry with this ' + customError + ' already exists' });
        }
        else if (err instanceof MessageCodeError) {
            /* MessageCodeError, Set all header variable to have a context for the client in case of MessageCodeError. */
            response.setHeader('x-message-code-error', err.messageCode);
            response.setHeader('x-message', err.errorMessage);
            response.setHeader('x-httpStatus-error', err.httpStatus);
            return response.status(err.httpStatus).json({ statusCode: err.httpStatus, message: err.errorMessage });
        } else {
            /* Any other internal error triggered by bad code :( */
            console.log('Unhandled Error', JSON.stringify(err));
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err && err.response || 'Internal Server Error' });
        }
    }
}