import {router} from '../main/main';
import BaseErrorHandler from './BaseErrorHandler'

/** Обработчик ошибок сервера */
export default class ServerExceptionHandler extends BaseErrorHandler{

    /**
     * Инициализация FormValidation
     * @param {Element} parent элемент в котором происходит обработка ошибок
     */
    constructor(parent, context) {
        super(parent);
        this._context = context;
    }

    /**
     * Обработка одной ошибки
     * @param {string} error сообщение ошибки
     * @private
     */
    _handleError(error){
        if (error.message in this._context) {
            let message = null, element = null;
            if (this._context[error.message] instanceof Function) {
                [message, element,] = this._context[error.message]();
            } else {
                [element, message,] = ([error.message].concat(this._context[error.message])).reverse();
            }

            if(element && message) {
                this._addError(element, message);
            }
        } else {
            console.log('error', error.code)
            router._goTo(`/error/${error.code}`);
            throw new Error('unknown server error');
        }
    }

    /**
     * Обработка списка ошибок
     * @param {Array} errors список ошибок
     */
    handle(errors){
        this._deleteErrors();
        errors.forEach((error) => {
            this._handleError(error);
        });
    }
}
