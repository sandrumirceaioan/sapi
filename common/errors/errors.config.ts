import { HttpStatus } from '@nestjs/common';
import { IErrorMessages } from './interfaces/error.interface';

export const errorMessagesConfig: { [messageCode: string]: IErrorMessages } = {
    'missing': {
        type: 'InternalServerError',
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: 'No message code was found for this error, please contact the administrator',
    },
    'Custom': {
        type: 'Custom',
        httpStatus: null,
        errorMessage: null,
    },

    // custom errors
    'general:params:missing': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Missing params.',
    },

    'user:login:unauthorized': {
        type: 'BadRequest',
        httpStatus: HttpStatus.UNAUTHORIZED,
        errorMessage: 'Unauthorized.',
    },

};

