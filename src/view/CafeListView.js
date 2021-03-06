'use strict';

import BaseView from './BaseView';
import {CafesContainerComponent} from '../components/CafesContainer/CafesContainer';
import Header from '../components/Header/Header';
import {router} from '../main/main';

/** View страницы со списком кафе */
export default class CafeListView extends BaseView{

    /**
     * Инициализация CafeListView
     * @param {Element} app элемент в котором находится приложение
     */
    constructor(app = document.getElementById('application')) {
        super(app);
    }

    /**
     * Отрисовка списка кафе
     * @param {obj} context контекст для отрисовки CafeListView
     */
    _renderCafes(context){

        const cafesContainer = document.createElement('div');
        (new CafesContainerComponent(cafesContainer)).render(context);
        this._app.appendChild(cafesContainer);

        let buttonAddCafe = document.getElementsByClassName(
            'cafes-page__add-cafe-field__add-button').item(0);
        buttonAddCafe.addEventListener('click',function () {
            router._goTo('/createCafe');
        }) // Need move to CafesContainerComponent
    }

    /** Отрисовка страницы со списком кафе */
    render() {
        this._app.innerHTML = '';
        (new Header(this._app)).render(this._context['header']);
        this._renderCafes(this._context['cafeList']);
    }
}
