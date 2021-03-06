'use strict';


export default class PageNotFoundController{


    constructor(pageNotFoundView, errorCode) {
        this._errorCode = errorCode;
        this._pageNotFoundView = pageNotFoundView;
    }

    _makeViewContext(){
        let context = {};
        //todo Хедер в зависимости от того зареган ли юзер
        context['header'] = {
            type: 'profile',

        };
        const code = Number(this._errorCode)
        switch (code) {

        case 404:
            context['error']={
                code: code,
                description:`
                404 ошибка краткое описание или чето еще
                `
            };
            break;
        case 405:
            context['error']={
                code: code,
                description:`
                405 ошибка краткое описание или чето еще
                `
            };
            break;

        case 406:
            context['error']={
                code: code,
                description:`
                406 ошибка краткое описание или чето еще
                `
            };
            break;
        default:
            context['error']={
                code: code,
                description:`
                Что-то новенькое 
                `
            };
            break;
        }

        return context;
    }



    /** Запуск контроллера */
    async control(){
        let context = this._makeViewContext()
        console.log('control',context)
        this._pageNotFoundView.render(this._makeViewContext(context));
    }
}
