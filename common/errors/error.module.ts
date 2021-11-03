import { errorMessagesConfig } from './errors.config';
import { IErrorMessages } from './interfaces/error.interface';

export class MessageCodeError extends Error {
    public messageCode: string;
    public custom: any;
    public httpStatus: number;
    public errorMessage: string;

    constructor(messageCode: string, custom = null) {
        super();

        const errorMessageConfig = this.getMessageFromMessageCode(messageCode);
        if (!errorMessageConfig) throw new Error('Unable to find message code error.');

        if (custom && custom.status && custom.message) {
            Error.captureStackTrace(this, this.constructor);
            this.name = this.constructor.name;
            this.httpStatus = custom.status;
            this.messageCode = messageCode;
            this.errorMessage = custom.message;
        } else {
            Error.captureStackTrace(this, this.constructor);
            this.name = this.constructor.name;
            this.httpStatus = errorMessageConfig.httpStatus;
            this.messageCode = messageCode;
            this.errorMessage = errorMessageConfig.errorMessage;
        }
    }

    /**
     * @description: Find the error config by the given message code.
     * @param {string} messageCode
     * @return {IErrorMessages}
     */
    private getMessageFromMessageCode(messageCode: string): IErrorMessages {
        let errorMessageConfig: IErrorMessages | undefined;
        Object.keys(errorMessagesConfig).some(key => {
            if (key === messageCode) {
                errorMessageConfig = errorMessagesConfig[key];
                return true;
            }
            return false;
        });

        if (!errorMessageConfig) throw new MessageCodeError('missing');
        return errorMessageConfig;
    }
}