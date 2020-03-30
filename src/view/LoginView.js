'use strict';

import LoginComponent from "../components/Login/Login";
import Header from "../components/MainHeader/Header";
import BaseView from "./BaseView";

export default class LoginView extends BaseView {

    constructor(app = document.getElementById('application')) {
        super(app);
    }

    _renderLogin(){
        let loginContainer = document.createElement('div');
        loginContainer.className = 'loginContainer';
        this._app.appendChild(loginContainer);
        (new LoginComponent(loginContainer)).render(this._context['login']);
    }

    render(){
        this._app.innerHTML = '';
        (new Header(this._app)).render(this._context['header']);
        this._renderLogin();
    }
}