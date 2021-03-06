'use strict';

import {uuid} from '../utils/uuid';
import {CardField} from './CardField.js';
import {ajax} from '../utils/ajax';
import {constants} from '../utils/constants';
import {ajaxForm} from '../utils/ajaxForm';
import {AlertWindowComponent} from '../components/AlertWindow/AlertWindow';


/** Модель карточки */
export class AppleCardModel {

    /**
     * Инициализация модели карточки
     * @param {int} cafeId идентификатор кафе
     */
    constructor(context) {
        console.log('constructor ', context)
        this._location = null;
        this._latitude = null;
        this._longitude = null;
        this._cafeId = context.id;
        this._type = 'coffee_cup';
        this._loyalty_info = { };
        this._icon = null;
        this._strip = null;
        this._organizationName = context.name;
        this._description = 'Описание';
        this._labelColor = null;
        this._logoText = null;
        this._foregroundColor = null;
        this._backgroundColor = null;
        this._backFields = [];
        this._storeCard = {
            'headerFields': [],
            'primaryFields': [],
            'secondaryFields': [],
            'auxiliaryFields': [],
        };
        if(context.location){
            this._latitude = context.location.split(' ')[0];
            this._longitude = context.location.split(' ')[1];
            this._location = context.location;
        }


        this._minDesign = `{
        "barcode": {"format": "PKBarcodeFormatQR",
     "message": "db64999a-d280-4b5f-895c-038cf92c1ab2",
      "messageEncoding": "iso-8859-1"},
       "logoText": "Название",
         "storeCard": {
         "headerFields": [{"key": "_676325044", "label": "Карта", "value": "лояльности"}],
          "primaryFields": [{"key": "_768436380", "label": "область", "value": "Главная"}],
          "secondaryFields": [{"key": "_768436380", "label": "Добавьте", "value": "текст"}]
          },
           "backFields": [], "labelColor": "rgb(0, 0, 0)", "description": "Описание", "serialNumber": "<<CustomerID>>",
            "formatVersion": 1, "webServiceURL": "https://s-soboy.com/api", "teamIdentifier": "WSULUSUQ63",
             "backgroundColor": "rgb(255, 255, 255)", "foregroundColor": "rgb(0, 0, 0)",
              "organizationName": "Кафе", "passTypeIdentifier": "pass.ru.kartochka",
               "authenticationToken": "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc"}`;

    }

    async update(type){
        await this.getCard(type);
    }

    get location() {
        return this._location;
    }
    set location(value) {
        this._location = value;
    }
    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        this._latitude = value;
    }
    get longitude() {
        return this._longitude;
    }
    set longitude(value) {
        this._longitude = value;
    }

    /**
     * Возвращает сырое представление карточки
     * @return {obj}
     */
    get context() {
        const cafeCard = sessionStorage.getItem(`card ${this._cafeId}`);
        if (cafeCard) {
            return(JSON.parse(cafeCard));
        }
        return null;
    }

    /**
     * Устанавливает контекст
     * @param {obj} context контекст модели
     */
    set context(context) {

    }

    /**
     * Получить название организации
     * @return {string|null}
     */
    get organizationName() {
        return this._organizationName;
    }

    /**
     * Устанавливает название организации
     * @param {string} value название организации
     */
    set organizationName(value) {
        this._organizationName = value;
    }

    /**
     * Получить описание кафе
     * @return {string|null}
     */
    get description() {
        return this._description;
    }

    /**
     * Устанавливает описание кафе
     * @param {string} value описание кафе
     */
    set description(value) {
        this._description = value;
    }

    /**
     * Получить цвет label карточки
     * @return {string|null}
     */
    get labelColor() {
        return this._labelColor;
    }

    /**
     * Устанавливает цвет label карточки
     * @param {string} value цвет label карточки
     */
    set labelColor(value) {
        this._labelColor = value;
    }

    /**
     * Получить текст логотипа
     * @return {string|null}
     */
    get logoText() {
        return this._logoText;
    }

    /**
     * Устанавливает текст логотипа
     * @param {string} текст логотипа
     */
    set logoText(value) {
        this._logoText = value;
    }

    get type() {
        return this._type;
    }

    /**
     * Устанавливает текст логотипа
     * @param {string} текст логотипа
     */
    set type(value) {
        this._type = value;
    }

    get loyalty_info() {
        return this._loyalty_info;
    }

    /**
     * Устанавливает текст логотипа
     * @param {string} текст логотипа
     */
    set loyalty_info(value) {
        this._loyalty_info = value;
    }

    /**
     * Получить цвет переднего плана карточки
     * @return {string|null}
     */
    get foregroundColor() {
        return this._foregroundColor;
    }

    /**
     * Устанавливает цвет переднего плана карточки
     * @param {string}  цвет переднего плана карточки
     */
    set foregroundColor(value) {
        this._foregroundColor = value;
    }

    /**
     * Получить цвет фона карточки
     * @return {string|null}
     */
    get backgroundColor() {
        return this._backgroundColor;
    }

    /**
     * Устанавливает цвет фона карточки
     * @param {string} цвет фона карточки
     */
    set backgroundColor(value) {
        this._backgroundColor = value;
    }

    /**
     * Получить поля хэдера карточки
     * @return {Array|null}
     */
    get headerFields() {
        return this._headerFields;
    }

    /**
     * Устанавливает поля хэдера карточки
     * @param {Array} поля хэдера карточки
     */
    set headerFields(value) {
        this._headerFields = value;
    }

    /**
     * Удаляет поле карточки по его id и типу
     * @param {string} type тип поля
     * @param {int} id идентификатор поля
     */
    removeFieldByTypeAndId(type, id) {
        this._storeCard[type] = this._storeCard[type].filter(field => field._id !== id);
    }

    /**
     * Возвращает карточку в виде json
     * @return {obj}
     */
    getAsJson() {
        console.log('json test', this._storeCard['headerFields']);
        let json = {
            'formatVersion': 1,
            'passTypeIdentifier': 'pass.ru.kartochka',
            'serialNumber': '<<CustomerID>>',
            'teamIdentifier': 'WSULUSUQ63',
            'webServiceURL': 'https://s-soboy.com/api',
            'authenticationToken': 'vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc',
            'barcode': {
                'message': `${constants.PATH}/points/<<CustomerID>>`,
                'format': 'PKBarcodeFormatQR',
                'messageEncoding': 'iso-8859-1'
            },
            'organizationName': this._organizationName,
            'description': this._description,
            'labelColor': this._labelColor,
            'logoText': (this._storeCard['headerFields'][0] !== undefined)?this._storeCard['headerFields'][0]._label:'',
            'foregroundColor': this._foregroundColor,
            'backgroundColor': this._backgroundColor,
            'backFields': [
                {
                    'key': 'survey',
                    'label': 'Опрос',
                    'value': `${constants.CURRENT_PATH}/survey/${this._cafeId}/<<CustomerID>>`
                }
            ],
            'storeCard': {
                'headerFields': [],
                'primaryFields': [],
                'secondaryFields': [],
                'auxiliaryFields': [],
            }
        };
        if(this._location){
            json['locations'] =  [
                {
                    'longitude': Number(this._latitude),
                    'latitude': Number(this._longitude),
                    'relevantText': `Заходи в ${this._organizationName}!`
                },
            ];

        }


        this._storeCard['headerFields'].slice(1, this._storeCard['headerFields'].length).forEach(field => {
            json.storeCard.headerFields.push(field.getAsJson())
        });

        this._storeCard['primaryFields'].forEach(field => {
            json.storeCard.primaryFields.push(field.getAsJson())
        });
        this._storeCard['secondaryFields'].forEach(field => {
            json.storeCard.secondaryFields.push(field.getAsJson())
        });
        this._storeCard['auxiliaryFields'].forEach(field => {
            json.storeCard.auxiliaryFields.push(field.getAsJson())
        });

        return json;
    }

    /**
     * Возвращает карточку как formData
     * @return {FormData}
     */
    getAsFormData() {
        let fd = {
            stripImageSrc: this._strip,
            logoImageSrc: this._icon,
            qrCodeImageSrc: 'https://sun9-66.userapi.com/c853624/v853624565/1f56ee/O8_4ZwO3xXY.jpg',
            logoText: this._logoText,
            backgroundColor: this._backgroundColor,
            foregroundColor: this._foregroundColor,
            labelColor: this._labelColor,
            headerFields: [],
            primaryFields: [],
            secondaryFields: [],
            auxiliaryFields: [],
        };

        for (let i = 0; i < this._storeCard['headerFields'].length; i++) {
            let field;
            if (i === 0) {
                field = this._storeCard['headerFields'][i].getAsFormData(undefined, true);
            } else {
                field = this._storeCard['headerFields'][i].getAsFormData(i - 1, false);
            }
            fd.headerFields.push(field);
        }

        for (let i = 0; i < this._storeCard['primaryFields'].length; i++) {
            let field = this._storeCard['primaryFields'][i].getAsFormData(i, false);
            fd.primaryFields.push(field);
        }
        for (let i = 0; i < this._storeCard['secondaryFields'].length; i++) {
            let field = this._storeCard['secondaryFields'][i].getAsFormData(i, false);
            fd.secondaryFields.push(field);
        }
        return fd;
    }

    /**
     * Добавить поле в карточку
     * @param {string} fieldType тип добавляемого поля
     */
    pushField(fieldType) {
        switch (fieldType) {
        case 'HeaderField':
            this._storeCard.headerFields.push(new CardField({'fieldType': 'HeaderField'}));
            break;

        case 'PrimaryField':
            this._storeCard.primaryFields.push(new CardField({'fieldType': 'PrimaryField'}));
            break;

        case 'SecondaryField':
            this._storeCard.secondaryFields.push(new CardField({'fieldType': 'SecondaryField'}));
            break;

        case 'AuxiliaryField':
            this._storeCard.auxiliaryFields.push(new CardField({'fieldType': 'AuxiliaryField'}));
            break;

        }
    }
    /**
     * Добавить поле в карточку
     * @param {string} fieldType тип добавляемого поля
     */
    allowPushField(fieldType) {
        switch (fieldType) {
        case 'HeaderField':
            if(this._storeCard.headerFields.length < 1){
                return true
            } else {
                return false
            }
        case 'PrimaryField':
            if(this._storeCard.primaryFields.length < 2
                && this._storeCard.primaryFields[0]._label.length < 5
                && this._storeCard.primaryFields[0]._value.length < 5){
                return true
            } else {
                return false
            }
        case 'SecondaryField':
            if(this._storeCard.secondaryFields.length < 3){
                // let symbolsLabel = 0; todo внедрить проверку
                // let symbolsValue = 0;
                // for(let i = 0; i < this._storeCard.secondaryFields.length; i++){
                //     symbolsLabel += this._storeCard.secondaryFields[i]._label.length;
                //     symbolsValue += this._storeCard.secondaryFields[i]._value.length;
                // }

                return true
            } else {
                return false
            }
        case 'AuxiliaryField':
            return false

        }
    }

    /**
     * Удалить поле карточки
     * @param {string} fieldType тип поля
     * @param {int} id иденитфикатор поля
     */
    removeField(fieldType, id) {
        switch (fieldType) {
        case 'HeaderField':
            this.removeFieldByTypeAndId('headerFields', id);
            break;
        case 'PrimaryField':
            this.removeFieldByTypeAndId('primaryFields', id);
            break;
        case 'SecondaryField':
            this.removeFieldByTypeAndId('secondaryFields', id);
            break;
        case 'AuxiliaryField':
            this.removeFieldByTypeAndId('auxiliaryFields', id);
            break;
        }
    }

    /**
     * Изменить поле
     * @param {string} fieldType тип поля
     * @param {int} id идентификатор поля
     * @param {string} type тип поля
     * @param {string} text текст поля
     */
    changeField(fieldType, id, type, text) {
        switch (fieldType) {
        case 'HeaderField':
            for (let i = 0; i < this._storeCard.headerFields.length; i++) {
                if (this._storeCard.headerFields[i]._id === id) {
                    if (type === 'labelField') {
                        this._storeCard.headerFields[i].label = text;
                    } else if (type === 'valueField') {
                        this._storeCard.headerFields[i].value = text;
                    }
                }
            }
            break;
        case 'PrimaryField':
            for (let i = 0; i < this._storeCard.primaryFields.length; i++) {
                if (this._storeCard.primaryFields[i]._id === id) {
                    if (type === 'labelField') {
                        this._storeCard.primaryFields[i].label = text;
                    } else if (type === 'valueField') {
                        this._storeCard.primaryFields[i].value = text;
                    }
                }
            }
            break;

        case 'SecondaryField':
            for (let i = 0; i < this._storeCard.secondaryFields.length; i++) {
                if (this._storeCard.secondaryFields[i]._id === id) {
                    if (type === 'labelField') {
                        this._storeCard.secondaryFields[i].label = text;
                    } else if (type === 'valueField') {
                        this._storeCard.secondaryFields[i].value = text;
                    }
                }
            }
            break;

        case 'AuxiliaryField':
            for (let i = 0; i < this._storeCard.auxiliaryFields.length; i++) {
                if (this._storeCard.auxiliaryFields[i]._id === id) {
                    if (type === 'labelField') {
                        this._storeCard.auxiliaryFields[i].label = text;
                    } else if (type === 'valueField') {
                        this._storeCard.auxiliaryFields[i].value = text;
                    }
                }
            }
            break;
        }

    }

    /**
     * Создание базовой карточки
     * @param {obj} design нектороый контекст карточки
     * @private
     */
    _fillStoreCardByDesign(design){

        // логотекст считаем за 0 хедер поле
        this._storeCard.headerFields.push(new CardField({
            'fieldType': 'HeaderField',
            'key': uuid(),
            'label': design.logoText,
            'value': 'valueH'
        }));

        //заполняем хедер филды
        if( !design.storeCard.headerFields ){
            this._storeCard.headerFields.push(new CardField({
                'fieldType': 'HeaderField',
                'key': uuid(),
                'label': '',
                'value': ''
            }));
        } else {
            console.log('Has HeaderFields');
            design.storeCard.headerFields.forEach((headerField)=>{
                this._storeCard.headerFields.push(new CardField({
                    'fieldType': 'HeaderField',
                    'key': uuid(),
                    'label': headerField.label,
                    'value': headerField.value,
                }));
            })
        }
        if( !design.storeCard.primaryFields ){
            this._storeCard.primaryFields.push(new CardField({
                'fieldType': 'PrimaryField',
                'key': uuid(),
                'label': '',
                'value': ''
            }));
        } else {
            design.storeCard.primaryFields.forEach((primaryField)=>{
                this._storeCard.primaryFields.push(new CardField({
                    'fieldType': 'PrimaryField',
                    'key': uuid(),
                    'label': primaryField.label,
                    'value': primaryField.value
                }));
            })
        }

        if( !design.storeCard.secondaryFields ){
            this._storeCard.secondaryFields.push(new CardField({
                'fieldType': 'SecondaryField',
                'key': uuid(),
                'label': '',
                'value': ''
            }));
        } else {
            design.storeCard.secondaryFields.forEach((secondaryField)=>{
                this._storeCard.secondaryFields.push(new CardField({
                    'fieldType': 'SecondaryField',
                    'key': uuid(),
                    'label': secondaryField.label,
                    'value': secondaryField.value
                }));
            })
        }
    }

    /**
     * Заполнение полей карточки из контекста
     * @param {obj} context контекст карточки
     * @private
     */
    _fillCardData(context){
        console.log('filldata', context)
        const jsonDesign =  (context.design !=='' )?context.design: this._minDesign;
        const design =  JSON.parse(jsonDesign);
        if(context.location){
            this._latitude = context.location.split(' ')[0];
            this._longitude = context.location.split(' ')[1];
            this._location = context.location;
        }
        this._icon = context.icon;
        this._strip = context.strip;
        this._description = design.description;
        this._labelColor = design.labelColor;
        this._logoText = design.logoText;
        this._foregroundColor = design.foregroundColor;
        this._backgroundColor = design.backgroundColor;
        this._backFields = [];
        this._type = context.type;
        this._loyalty_info = context.loyalty_info;
        this._storeCard = {
            'headerFields': [],
            'primaryFields': [],
            'secondaryFields': [],
            'auxiliaryFields': [],
        };
        this._fillStoreCardByDesign(design);
    }

    /**
     * Получение карточки
     * @return {Promise<void>}
     */
    async getCard(type) {

        await ajax(constants.PATH +
            `/api/v1/cafe/${this._cafeId}/apple_pass/${type}?published=true`,
        'GET',
        {},
        (response) => {
            if (response.data == null) {
                console.log('null data: ', response.data);
                this._fillCardData({design: this._minDesign});
                //router._goTo('/createCafe');
            } else {
                if (response.errors === null) {
                    this._fillCardData(response.data);
                } else {
                    throw response.errors;
                }
            }
        }
        )
    }


    /**
     * Создание formData для создания карточки
     * @param {Array} images картинки
     * @return {Promise<FormData>}
     * @private
     */
    async _makeFormData(images, loyalty) {
        console.log('fdtest', JSON.stringify(loyalty.type), JSON.stringify(loyalty.loyalty_info))
        let formData = new FormData();
        const data = this.getAsJson();
        //const loyaltyInfo = this.getLoyaltyInfo();
        formData.append('jsonData', JSON.stringify(data));
        formData.append('type',JSON.stringify(loyalty.type));
        formData.append('loyalty_info',JSON.stringify(loyalty.loyalty_info))
        if (images['icon.png'] && images['strip.png']) {
            formData.append('icon.png',(images['icon.png'])?images['icon.png']:this._icon) ;
            formData.append('icon@2x.png',(images['icon@2x.png'])?images['icon@2x.png']:this._icon);
            formData.append('logo.png',(images['logo.png'])?images['logo.png']:this._icon );
            formData.append('logo@2x.png',(images['logo@2x.png'])?images['logo@2x.png']:this._icon);
            formData.append('strip.png',(images['strip.png'])?images['strip.png']:this._strip  );
            formData.append('strip@2x.png',(images['strip@2x.png'])?images['strip@2x.png']:this._strip);
        }
        //formData.append({'type': this._type});
        //formData.append({'loyalty_info': JSON.stringify(this._loyalty_info)});
        return formData;
    }


    /**
     * Изменение карточки
     * @param {Array} images
     * @param publish
     * @return {Promise<void>}
     */
    async editCard(images, loyalty, publish) {
        const formData = await this._makeFormData(images, loyalty);
        await ajaxForm(constants.PATH +
            `/api/v1/cafe/${this._cafeId}/apple_pass/${loyalty.type}?publish=${publish.toString()}`, //todo make await
        'PUT',
        formData,
        (response) => {
            if (response.errors === null) {
                console.log('editCard success', response);
                if(response.data['QR'] && response.data['URL'] && publish){
                    console.log('window component');
                    (new AlertWindowComponent('Ваша карточка опубликована',
                        response.data['URL'], response.data['QR'])).render();

                } else if(response.data['QR'] && response.data['URL'] && !publish) {
                    (new AlertWindowComponent('Ваша карточка сохранена',
                        response.data['URL'], response.data['QR'])).render();
                }
            } else {
                console.log('error ', response.errors);
                throw response.errors;
            }


        }
        );
    }
}

