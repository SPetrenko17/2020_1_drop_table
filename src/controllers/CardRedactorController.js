'use strict';

import {getContextByClass} from '../utils/cardRedactorUtils'
import NotificationComponent from '../components/Notification/Notification';
import ServerExceptionHandler from '../utils/ServerExceptionHandler';
import {LoyaltyStampComponent} from '../components/LoyaltySystems/Stamp/LoyaltyStampComponent';
import {LoyaltyDiscountComponent} from '../components/LoyaltySystems/Discount/LoyaltyDiscountComponent';
import {LoyaltyWalletComponent} from '../components/LoyaltySystems/Wallet/LoyaltyWalletComponent';
import {LoyaltyCouponComponent} from '../components/LoyaltySystems/Coupon/LoyaltyCouponComponent';
import {router} from '../main/main';

/** Контроллер редактирования карточки */
export default class CardRedactorController {

    /**
     * Инициализация контроллер редактирования карточки
     * @param {AppleCardModel} appleCardModel модель карточки
     * @param {CardRedactorView} cardRedactorView view редактора карточки
     */
    constructor(appleCardModel, cardRedactorView) {
        this._appleCard = appleCardModel;
        this._cardRedactorView = cardRedactorView;
        this._loyaltyInfo = {
            type: 'coffee_cup',
            loyalty_info: {'coffee_cups': 5}
        };
        this._discounts = []
    }

    async changeType(){
        try{
            await this._appleCard.update(this._loyaltyInfo.type);
            this._appleCard._type = this._loyaltyInfo.type;
        } catch (exception) {
            (new ServerExceptionHandler(document.body, this._makeExceptionContext())).handle(exception);
        }
        this.control(true);
    }

    async update(){
        try{
            await this._appleCard.update(this._loyaltyInfo.type);
        } catch (exception) {
            (new ServerExceptionHandler(document.body, this._makeExceptionContext())).handle(exception);
        }
    }



    /** Запуск контроллера */
    async control(test){
        try {
            if(!test) {
                await this.update();
            }

            this._appleCard.context =  this._makeContext();
            this._cardRedactorView._appleCard = this._appleCard;


            this._cardRedactorView.render();

            this._addHoverListeners();

            this.addImageListeners();
            this.addCardFieldsListeners();
            this.addSavePublishListeners();
            this.addColorPickerListeners();
            this._addLoyaltyListeners();
            if(!test){
                let cardRedactorBottom =
                    document.getElementsByClassName('loyalty-redactor_h4').item(0);
                cardRedactorBottom.scrollIntoView({block: 'start', behavior: 'smooth'});
                this._makeActiveLoyalty(0);
            }


        } catch (error) {
            console.log(error.message);
        }

    }

    _addHoverListeners(){
        //card-redactor-container__card-form__image-picker_img
        //card-redactor-container__card-form__image-picker_img-avatar
        let stripListenerOver = ()=>{
            let cardStrip = document.getElementsByClassName('card__strip').item(0);
            cardStrip.style.boxShadow = '0 0 10px #9ecaed';
        };
        let stripListenerOut = ()=>{
            let cardStrip = document.getElementsByClassName('card__strip').item(0);
            cardStrip.style.boxShadow = null;
        };

        let stripImgListenerOver = ()=>{
            let cardStrip = document.getElementsByClassName('card__strip').item(0);
            if(!this._appleCard._strip){
                cardStrip.style.backgroundImage = `url(/images/strip.png)`;
            }
            cardStrip.style.boxShadow = '0 0 10px #9ecaed';
        };
        let stripImgListenerOut = ()=>{
            let cardStrip = document.getElementsByClassName('card__strip').item(0);
            cardStrip.style.boxShadow = null;
            if(!this._appleCard._strip){
                cardStrip.style.backgroundImage = null;
            }
        };
        let logoImgOver = ()=>{
            let logoImg = document.getElementsByClassName('card__header_img').item(0);
            if(this._appleCard._icon){
                logoImg.style.boxShadow = '0 0 10px #9ecaed';
            } else{
                logoImg.src = '/images/cardlogo.png';
                logoImg.style.display = 'flex';
                logoImg.style.boxShadow = '0 0 10px #9ecaed';
            }
        };
        let logoImgOut = ()=>{
            let logoImg = document.getElementsByClassName('card__header_img').item(0);
            if(this._appleCard._icon){
                logoImg.style.boxShadow = null;
            } else{
                logoImg.src = '';
                logoImg.style.display = 'none';
                logoImg.style.boxShadow = null;
            }
        };

        let logoImg = document.getElementsByClassName(
            'card-redactor-container__card-form__image-picker_img-avatar').item(0);

        logoImg.addEventListener('mouseover', logoImgOver );
        logoImg.addEventListener('mouseout', logoImgOut );
        let headerFields = document.getElementsByClassName('HeaderFieldsContainer').item(0);
        headerFields.addEventListener('mouseover',()=>{
            let cardHeader = document.getElementsByClassName('card__header').item(0);
            cardHeader.style.boxShadow = '0 0 10px #9ecaed';
        });
        headerFields.addEventListener('mouseout',()=>{
            let cardHeader = document.getElementsByClassName('card__header').item(0);
            cardHeader.style.boxShadow = null
        });

        let stripImage = document.getElementsByClassName(
            'card-redactor-container__card-form__image-picker_img').item(0);
        let primaryFields = document.getElementsByClassName('PrimaryFieldsContainer').item(0);
        primaryFields.addEventListener('mouseover',stripListenerOver);
        primaryFields.addEventListener('mouseout',stripListenerOut);
        stripImage.addEventListener('mouseover',stripImgListenerOver);
        stripImage.addEventListener('mouseout',stripImgListenerOut);

        let secondaryFields = document.getElementsByClassName('SecondaryFieldsContainer').item(0);
        secondaryFields.addEventListener('mouseover',()=>{
            let cardHeader = document.getElementsByClassName('card__header__fields').item(0);
            cardHeader.style.boxShadow = '0 0 10px #9ecaed';
        });
        secondaryFields.addEventListener('mouseout',()=>{
            let cardHeader = document.getElementsByClassName('card__header__fields').item(0);
            cardHeader.style.boxShadow = null;
        });
    }

    /**
     * Создание контекста для CardRedactorView
     * @return {Promise<{appleCard: any}>}
     * @private
     */
    _makeContext(){
        let appleCardContext = {
            appleCard: this._appleCard.context
        };
        return appleCardContext;
    }

    /** Event, выполняющийся при нажатии на кнопку */
    editTextInputListener(e) {
        const target = e.target;
        this._appleCard.changeField(
            getContextByClass(target.parentNode.getAttribute('class')),
            target.parentNode.getAttribute('id'),
            target.getAttribute('class'),
            target.value);
        this._cardRedactorView.cardAppleComp.render(this._appleCard.getAsFormData());

        this.addSavePublishListeners();
        this.addImageListeners()
    }

    /**
     * Добавление лисенеров для color pickers
     * @param {obj} context контекст необходимый для создания color pickers
     */
    addColorPickerListeners() {

        function hexToRgb(hex) {

            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        function getHexRGBColor(color)
        {
            color = color.replace(/\s/g,'');
            let aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
            if(aRGB) {
                color = '';
                for (let i = 1; i <= 3; i++) {
                    color += Math.round(
                        (aRGB[i][aRGB[i].length - 1] == '%' ? 2.55 : 1) * parseInt(aRGB[i])).toString(16)
                        .replace(/^(.)$/, '0$1');
                }
            }
            else {
                color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');
            }
            return `#${color}`;
        }



        let backgroundColorInput = document.getElementsByClassName(
            'card-color-pickers-container_color-picker__inputs__background_input').item(0);
        backgroundColorInput.value = getHexRGBColor(this._appleCard.backgroundColor);


        //backgroundColorInput.value = context._appleCard._backgroundColor;
        backgroundColorInput.addEventListener('input', function () {
            let backgroundColorInput = document.getElementsByClassName(
                'card-color-pickers-container_color-picker__inputs__background_input').item(0);
            let res = hexToRgb(backgroundColorInput.value);
            this._appleCard._backgroundColor = `rgb(${res.r},${res.g},${res.b})`;
            this._cardRedactorView.cardAppleComp._renderBackgroundColor(this._appleCard._backgroundColor);
        }.bind(this), false);

        let labelColorInput = document.getElementsByClassName(
            'card-color-pickers-container_color-picker__inputs__label_input').item(0);
        labelColorInput.value = getHexRGBColor(this._appleCard.labelColor);
        labelColorInput.addEventListener('input', function () {
            let labelColorInput = document.getElementsByClassName(
                'card-color-pickers-container_color-picker__inputs__label_input').item(0);
            let res = hexToRgb(labelColorInput.value);
            this._appleCard._foregroundColor = `rgb(${res.r},${res.g},${res.b})`;
            this._appleCard._labelColor = `rgb(${res.r},${res.g},${res.b})`;
            this._cardRedactorView.cardAppleComp._renderLabelColor(this._appleCard._labelColor);
            this._cardRedactorView.cardAppleComp._renderForegroundColor(this._appleCard._foregroundColor);
        }.bind(this))


    }


    /**Добавление листенеров на зполя карточки */
    addCardFieldsListeners() {
        const labelInputs = document.getElementsByClassName('labelField');
        const valueInputs = document.getElementsByClassName('valueField');
        const fieldButtons = document.getElementsByClassName('field-button');
        for (let i = 0; i < labelInputs.length; i++) {
            labelInputs.item(i).addEventListener('input', this.editTextInputListener.bind(this));
        }
        for (let i = 0; i < valueInputs.length; i++) {
            valueInputs.item(i).addEventListener('input', this.editTextInputListener.bind(this));
        }
        for (let i = 0; i < fieldButtons.length; i++) {
            const buttonType = fieldButtons.item(i).getElementsByClassName('button-text').item(0).innerText;
            if (buttonType === 'Добавить') {
                fieldButtons.item(i).addEventListener('click', this.addCardField.bind(this));
            } else {
                fieldButtons.item(i).addEventListener('click', this.removeAppleCardField.bind(this));
            }
        }
    }

    //todo пофиксить, когда будут новые ручки с сервера
    /** Добавление листенеров для публикации */
    addSavePublishListeners(){
        // const submitSave = document.getElementsByClassName('card-form__buttons__save').item(0);
        // submitSave.addEventListener('click', this._editCardListener.bind(this));

        const submitPublish = document.getElementsByClassName('card-form__buttons__publish').item(0);
        submitPublish.addEventListener('click', this._publishCardListener.bind(this));
    }

    _publishCardListener(e){
        e.preventDefault();
        const iconInput = document.getElementById('uploadAvatar');
        let icon = iconInput.files[0];
        const stripInput = document.getElementById('uploadStrip');
        let strip = stripInput.files[0];

        if(strip === null){
            strip = this._appleCard._strip;

        }
        if(icon === null){
            icon = this._appleCard._icon;
        }

        const images ={
            'icon.png': icon,
            'icon@2x.png': icon,
            'logo.png': icon,
            'logo@2x.png': icon,
            'strip.png': strip,
            'strip@2x.png': strip
        };
        if(this._loyaltyInfo.type === 'percents'){
            this._loyaltyInfo.loyalty_info = this.objectFromDiscounts(this._discounts);
        }
        try {
            this._appleCard.editCard(images,this._loyaltyInfo,true);
        } catch (exception) {
            (new ServerExceptionHandler(document.body, this._makeExceptionContext())).handle(exception);
        }
    }

    _editCardListener(e) {
        e.preventDefault();

        const iconInput = document.getElementById('uploadAvatar');
        let icon = iconInput.files[0];

        const stripInput = document.getElementById('uploadStrip');
        let strip = stripInput.files[0];

        //todo Попросить Диму принимать урлы а не только изображения
        if(!strip){
            strip = this._appleCard._strip;
        }
        if(!icon){
            icon = this._appleCard._icon;
        }
        const images ={'icon.png': icon, 'icon@2x.png': icon,
            'logo.png': icon, 'logo@2x.png': icon,
            'strip.png': strip, 'strip@2x.png': strip
        };
        if(this._loyaltyInfo.type === 'percents'){
            this._loyaltyInfo.loyalty_info = this.objectFromDiscounts(this._discounts);
        }

        try {
            this._appleCard.editCard(images, this._loyaltyInfo, false);
        } catch (exception) {
            (new ServerExceptionHandler(document.body, this._makeExceptionContext())).handle(exception);
        }
        console.log(' save apple card as json from controller', JSON.stringify(this._appleCard.getAsJson()));
    }

    /** Добавление полей карты */
    addCardField(e) {
        const parent = e.target.parentNode.parentNode;
        if(this._appleCard.allowPushField(getContextByClass(parent.getAttribute('class')))){
            this._appleCard.pushField(getContextByClass(parent.getAttribute('class')));
            this._cardRedactorView.cardFormComp.render(this._appleCard.getAsFormData());
            this._cardRedactorView.cardAppleComp.render(this._appleCard.getAsFormData());
            this.addCardFieldsListeners();
            this.addColorPickerListeners(this);
            this.addSavePublishListeners();
            if(this._appleCard._strip){
                const stripCardImage = document.getElementsByClassName('card__strip').item(0);
                stripCardImage.style.backgroundImage =  this._appleCard._strip;
            }
        }
    }

    /** Удаление полей карты */
    removeAppleCardField(e) {
        const parent = e.target.parentNode.parentNode;
        this._appleCard.removeField(getContextByClass(parent.getAttribute('class')), parent.getAttribute('id'));
        this._cardRedactorView.cardFormComp.render(this._appleCard.getAsFormData());
        this._cardRedactorView.cardAppleComp.render(this._appleCard.getAsFormData());
        this.addCardFieldsListeners();
        this.addSavePublishListeners();
        this.addColorPickerListeners(this);
        if(this._appleCard._strip){
            const stripCardImage = document.getElementsByClassName('card__strip').item(0);
            stripCardImage.style.backgroundImage =  this._appleCard._strip;
        }
    }

    _makeExceptionContext(){
        return {
            'offline': () => {
                (new NotificationComponent('Похоже, что вы оффлайн.')).render();
                return [null, null]
            },
            'no permission': () => {
                router._goTo('/login');
                throw new Error('no permission');
            },
        }
    }

    /** Добавление листенеров на изображения */
    addImageListeners(){
        console.log('ADD IMAGES!!!!!!')
        const stripInput = document.getElementById('uploadStrip');
        const stripImage = document.getElementsByClassName(
            'card-redactor-container__card-form__image-picker_img').item(0);
        const stripCardImage = document.getElementsByClassName('card__strip').item(0);
        const avatarInput = document.getElementById('uploadAvatar');
        const avatarImage = document.getElementsByClassName(
            'card-redactor-container__card-form__image-picker_img-avatar').item(0);
        const avatarCardImage = document.getElementsByClassName('card__header_img').item(0);
        if(this._appleCard._strip) {
            let src = this._appleCard._strip.toString();
            if(src.includes('https')){
                stripImage.src = `${src}&time=${Math.random() * 500}`;
                stripCardImage.style.backgroundImage = `url(${src}&time=${Math.random() * 500})`;
            } else{
                stripImage.src = `${src}`;
                stripCardImage.style.backgroundImage = `url(${src})`;
            }
        } else{
            stripImage.src = `/images/strip.png`;
        }
        if(this._appleCard._icon){
            avatarCardImage.style.display = 'flex'; //todo пофиксить, когда будут новые ручки с сервера
            let src = this._appleCard._icon.toString();
            if(src.includes('https')){
                avatarImage.src =`${src}&time=${Math.random()*500}`;
                avatarCardImage.src = `${src}&time=${Math.random()*500}`;
            } else{
                avatarImage.src =`${src}`;
                avatarCardImage.src = `${src}`;
            }
        } else{
            avatarImage.src =`/images/cardlogo.png`;
        }
        console.log('set image icon', this._appleCard._icon );

        stripInput.addEventListener('change',(e)=>{
            let tgt = e.target, files = tgt.files;
            if (FileReader && files && files.length) {
                let fr = new FileReader();
                fr.onload = function () {
                    stripImage.src = fr.result;
                    stripCardImage.style.backgroundImage = `url(${fr.result})`;
                    this._appleCard._strip = `${fr.result}`;
                }.bind(this);
                fr.readAsDataURL(files[0]);
            }
        });
        console.log('set image icon 2' );

        avatarInput.addEventListener('change',(e)=>{
            const tgt = e.target, files = tgt.files;
            if (FileReader && files && files.length) {
                let fr = new FileReader();
                fr.onload = function () {
                    avatarImage.src = fr.result;
                    avatarCardImage.style.display = 'flex'; //todo пофиксить, когда будут новые ручки с сервера
                    avatarCardImage.src = fr.result;
                    this._appleCard._icon = fr.result;
                }.bind(this);
                fr.readAsDataURL(files[0]);
            }
        });
    }

    getJustifyContentBuIndex(i){
        switch (i) {
        case 0:
            return 'flex-start';
        case 1:
            return 'center';
        case 2:
            return 'center';
        case 3:
            return 'flex-end';


        }
    }

    async renderLoyaltySystem(i){
        const rect = document.getElementsByClassName('rect').item(0);
        rect.innerHTML = '';
        switch(i){
        case 0:
            this._loyaltyInfo.type = 'coffee_cup';
            await this.changeType();
            if(!await this._appleCard._loyalty_info){
                this._loyaltyInfo.loyalty_info = {'cups_count': 5};
                this._appleCard._loyalty_info = {cups_count: 5};
            } else{
                this._appleCard._loyalty_info = JSON.parse(await this._appleCard._loyalty_info);
            }
            (new LoyaltyStampComponent(rect)).render( await this._appleCard._loyalty_info);

            this._coffeeCupsInput = document.getElementsByClassName(
                'loyalty-stamp-container__logic_input').item(0);
            this._coffeeCupsInput.addEventListener('input',this.coffeeCupsListener.bind(this));
            break;
        case 1:

            this._loyaltyInfo.type = 'percents';
            await this.changeType();
            if(!await this._appleCard._loyalty_info){
                this._loyaltyInfo.loyalty_info = {1000:10};
                this._appleCard._loyalty_info = this._loyaltyInfo.loyalty_info;
            } else{

                this._loyaltyInfo.loyalty_info = JSON.parse(await this._appleCard._loyalty_info);
                this._appleCard._loyalty_info = this._loyaltyInfo.loyalty_info;
                console.log('percents ok',this._appleCard._loyalty_info );
            }
            console.log('percents render',this._appleCard._loyalty_info );
            this._discounts = this.discountsFromObject(this._loyaltyInfo.loyalty_info);
            (new LoyaltyDiscountComponent(rect)).render(await this._discounts);
            this.addDiscountsListeners();

            break;


        case 2:
            this._loyaltyInfo.type = 'cashback';
            await this.changeType();
            console.log('cashback test', await this._appleCard._loyalty_info);
            if(!await this._appleCard._loyalty_info){
                this._loyaltyInfo.loyalty_info = {'cashback': 10}
                this._appleCard._loyalty_info = {cashback: 10};
            } else{
                this._appleCard._loyalty_info = JSON.parse(await this._appleCard._loyalty_info)
            }
            (new LoyaltyWalletComponent(rect)).render(this._appleCard._loyalty_info);
            this._cashbackPercentsInput = document.getElementsByClassName(
                'loyalty-wallet-container__logic_input').item(0);
            this._cashbackPercentsInput.addEventListener('input',this.cashbackPercentsInputListener.bind(this))
            break;


        case 3:
            this._loyaltyInfo.type = 'coupon';
            this.changeType();
            (new LoyaltyCouponComponent(rect)).render();
            break;

        }

    }

    _addLoyaltyListeners(){
        let buttonsNormal = document.getElementsByClassName('loyalty-redactor__buttons__button-normal');
        let description = document.getElementsByClassName('loyalty-redactor__description-normal').item(0);
        for(let i = 0; i< buttonsNormal.length; i++){
            buttonsNormal.item(i).addEventListener('click',(e)=>{
                description.className = 'loyalty-redactor__description-active';
                description.style.justifyContent = this.getJustifyContentBuIndex(i);
                let buttonsActive = document.getElementsByClassName('loyalty-redactor__buttons__button-active');
                for(let i = 0; i < buttonsActive.length; i++){
                    buttonsActive.item(i).className = 'loyalty-redactor__buttons__button-normal';
                }
                e.target.parentNode.className = 'loyalty-redactor__buttons__button-active';
                this.renderLoyaltySystem(i);
            })
        }
    }
    _makeActiveLoyalty(i){
        let buttonsNormal = document.getElementsByClassName('loyalty-redactor__buttons__button-normal');
        let description = document.getElementsByClassName('loyalty-redactor__description-normal').item(0);
        description.className = 'loyalty-redactor__description-active';
        description.style.justifyContent = this.getJustifyContentBuIndex(i);
        let buttonsActive = document.getElementsByClassName('loyalty-redactor__buttons__button-active');
        if(buttonsActive.length) {
            for (let i = 0; i < buttonsActive.length; i++) {
                buttonsActive.item(i).className = 'loyalty-redactor__buttons__button-normal';
            }
        }
        console.log('test7',buttonsNormal)
        buttonsNormal.item(i).className = 'loyalty-redactor__buttons__button-active';
        this.renderLoyaltySystem(i);
    }
    coffeeCupsListener(e){
        if(Number(e.target.value)){
            this._loyaltyInfo.loyalty_info = {'cups_count':Number(e.target.value)};
        }
    }
    cashbackPercentsInputListener(e){
        if(Number(e.target.value)){
            this._loyaltyInfo.loyalty_info = {'cashback':Number(e.target.value)};
        }
    }


    addDiscountsListeners(){
        const button = document.getElementsByClassName(
            'loyalty-discount-container__logic__button-field__button').item(0);
        button.addEventListener('click',this.addDiscountListener.bind(this))

        let priceInputs = document.getElementsByClassName('discount-cell__form__price_input');
        for(let i = 0; i < priceInputs.length;i++){
            priceInputs.item(i).addEventListener('input', this.priceInputListener.bind(this))
        }

        let discountsInputs = document.getElementsByClassName('discount-cell__form__discount_input');
        for(let i = 0; i < discountsInputs.length;i++){
            discountsInputs.item(i).addEventListener('input', this.discountInputListener.bind(this))
        }


    }
    discountInputListener(e){
        let id = Number(e.target.id.split('-')[1]);
        if(Number(e.target.value)){
            this._discounts[id].discount = e.target.value
        }
    }
    priceInputListener(e){
        let id = Number(e.target.id.split('-')[1]);
        if(Number(e.target.value)){
            this._discounts[id].price = e.target.value
        }
    }
    addDiscountListener(){
        const rect = document.getElementsByClassName('rect').item(0);
        this._discounts.push({
            price: 0,
            discount: 0
        });
        (new LoyaltyDiscountComponent(rect)).render(this._discounts);
        this.addDiscountsListeners();
    }


    discountsFromObject(obj){
        let discounts = [];
        const entriesPolyFill = (context) => Object.keys(context).map(key => [key, context[key]]);
        let discountsObj = entriesPolyFill(obj);
        for(let i = 0; i < discountsObj.length; i++){
            discounts.push( {
                price: Number(discountsObj[i][0]),
                discount: Number(discountsObj[i][1])
            })
        }
        return discounts
    }
    objectFromDiscounts(discounts){
        let obj = {};
        for(let i = 0; i< discounts.length; i++){
            obj[discounts[i].price] = Number(discounts[i].discount);
        }
        return obj;
    }

}
