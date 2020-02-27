import {ajaxCreateCafe} from "../myCafePage/creation";
import ProfileComponent from "../../componentsAI/profile/profile";
import {handleImageUpload} from "../../modules/imageUpload";
import {validateForm} from "../../modules/formValidator";
import {constants} from "../../utils/constants";


function ajaxChangeUserData(route, formData, callback) {
    let req = new Request(route, {
        method: 'PUT',
        mode: 'cors',
        body: formData,
        credentials: 'include',
    });
    fetch(req)
        .then((response) => {
            if (response.ok) {
                return null;
            } else {
                throw new Error('BAD HTTP stuff');
            }
        })
        .then((formData) => {
            callback(formData);
        })
        .catch((err) => {
            console.log('ERROR:', err.message);
        });

}

function changeUserProfile(e) {
    e.preventDefault();
    const form = document.getElementsByClassName('formField').item(0);
    const photoInput = document.getElementById('upload');
    const userImage = document.getElementById('image').getAttribute('src');
    const id = form.elements['userId'].value;
    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const password1 = form.elements['password'].value;
    const photo = photoInput.files[0];
    if (validateForm(form)) {
        let formData = new FormData();

        let data = {
            'name': name.toString(),
            'email': email.toString(),
            'password': password1.toString()
        };

        if (photo) {
            formData.append('photo', photo);
        } else{
            data = {
                'name': name.toString(),
                'email': email.toString(),
                'password': password1.toString(),
                'photo': userImage.toString()
            };
        }

        formData.append('jsonData', JSON.stringify(data));

        ajaxChangeUserData(constants.PATH+'/api/v1/owner/' + id,
            formData
            , (response) => {
                if (response !== null) {
                    alert(response.errors[0].message); //TODO showError
                }
            });
    }


}


export function createUserProfilePage(app) {

    ajaxCreateCafe(constants.PATH+'/api/v1/getCurrentOwner/',
        {}, (response) => {

            if (response.errors === null) {

                let profile = {
                    imgSrc: response.data['photo'],
                    event: {
                        type: 'change',
                        listener: handleImageUpload
                    },
                    form: {
                        formFields: [
                            {
                                type: 'hidden',
                                id: 'userId',
                                data: response.data['id'],
                                labelData:'',
                                inputOption:'readonly',
                            },
                            {
                                type: 'text',
                                id: 'name',
                                data: response.data['name'],
                                labelData:'Имя',
                                inputOption:'required',
                            },
                            {
                                type: 'email',
                                id: 'email',
                                data: response.data['email'],
                                labelData:'Почта',
                                inputOption:'required',
                            },
                            {
                                type: 'password',
                                id: 'password',
                                data: response.data['password'],
                                labelData:'Пароль',
                                inputOption:'required'
                            },
                            {
                                type: 'password',
                                id: 're-password',
                                data: response.data['password'],
                                labelData:'Повторите пароль',
                                inputOption:'required'
                            },
                        ],
                        submitValue: 'Готово',
                        event: {
                            type: 'submit',
                            listener: changeUserProfile
                        },
                    },
                };
                (new ProfileComponent(app)).render(profile);
            } else {
                alert(response.errors[0].message); //TODO showError
            }
        });


}
