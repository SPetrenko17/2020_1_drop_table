import {renderRegister} from '../components/register/register';
import {renderBlankHeader, renderHeader} from '../components/header/header';
import {renderLogin} from '../components/login/login';
import {createCafes} from '../components/myCafePage/creation';
import {createUserProfilePage} from '../components/userProphilePage/creation';
import {createNewCafePage} from '../components/AddCafePage/creation';


const app = document.body;


let routes = [
    {
        url: '', callback: function () {
            app.innerHTML = '';
            app.appendChild(renderHeader());
            createCafes();
        }
    }
];


function getUrl() {
    return window.location.hash.substr(1);
}

function Routing() {
    let url = getUrl();
    let route = routes[0];
    routes.forEach(item => {
        if (url === item.url) {
            route = item;
        }
    });
    route.callback();
}


window.addEventListener('popstate', Routing);


setTimeout(Routing, 0);


routes.push({

    url: 'reg', callback: () => {
        app.innerHTML = '';
        app.appendChild(renderBlankHeader());
        app.appendChild(renderRegister());

    }
});
routes.push({
    url: 'login', callback: () => {
        app.innerHTML = '';
        app.appendChild(renderBlankHeader());
        app.appendChild(renderLogin());
    }

});

routes.push({
    url: 'myCafe', callback: () => {
        app.innerHTML = '';
        app.appendChild(renderHeader());
        createCafes();
    }

});

routes.push({
    url: 'profile', callback: () => {
        app.innerHTML = '';
        let up = document.createElement('div');
        createUserProfilePage(up);
        app.appendChild(renderHeader());
        app.appendChild(up);
    }

});

routes.push({
    url: 'createCafe', callback: () => {
        app.innerHTML = '';
        app.appendChild(renderHeader());
        createNewCafePage();
    }

});
