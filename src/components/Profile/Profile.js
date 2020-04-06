'use strict';

import './Profile.scss';
import ProfileTemplate from './Profile.hbs';
import Form from '../Form/Form.js';

/** Компонента профиля */
export default class ProfileComponent {

    /**
     * Инициализация компоненты профиля
     * @param {Element} parent элемент в котором будет располагаться компонента профиля
     */
    constructor(parent = document.getElementById('application')) {
        this._parent = parent;
        this._form = null;
    }

    /**
     * Добавление листенеров на элементы
     * @param {obj} context некоторый контекст с информацией о профиле
     * @private
     */
    _addListener(context) {
        const element = this._parent.getElementsByClassName('user-profile__header__logo-container_image-picker_input').item(0);
        element.addEventListener(
            context['event']['type'],
            context['event']['listener']
        );
    }

    /**
     * Обработка промисов
     * @param {obj} context некоторый контекст с информацией о профиле
     * @private
     */
    _handlePromises(context){
        if ('imgSrcPromise' in context){
            context['imgSrcPromise'].then((imgSrc) => {
                let imageElement = this._parent.getElementsByClassName(
                    'user-profile__header__logo-container_image-picker_img').item(0);
                imageElement.src = imgSrc;
            }, (exception) => {
                alert(exception); //TODO Сделать обработку ошибки
            })
        }
    }

    /**
     * Отрисовка профиля
     * @param {obj} context некоторый контекст с информацией о профиле
     * @private
     */
    renderProfile(context){
        this._parent.innerHTML += ProfileTemplate(context);
        let formCollection = this._parent.getElementsByClassName('user-profile__form-container__form-field').item(0);
        this._form = new Form(formCollection);
    }

    /**
     * Отрисовка формы
     * @param {obj} context некоторый контекст с информацией о профиле
     * @private
     */
    renderForm(context){
        this._form.render(context);
    }

    /**
     * Отрисовка профиля
     * @param {obj} context некоторый контекст с информацией о профиля
     */
    render(context) {
        this.renderProfile(context);
        this.renderForm(context['form']);
        this._addListener(context);
        this._handlePromises(context);
    }
}
