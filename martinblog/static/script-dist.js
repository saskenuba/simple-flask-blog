"use strict";

var sidebarSize = document.getElementById("sidebar").offsetWidth;
var mainElement = document.getElementById("main");

// At page load complete load
window.addEventListener('load', function (event) {

    // if mobile screen size
    if (isMobile(window.innerWidth)) {

        // remove sidebar
        var sidebar = document.getElementById('sidebar');
        sidebar.parentElement.removeChild(sidebar);

        // fix me
        var bottombar = document.createElement('div');
        var mysnippet = "<nav class='ui sidebar inverted bottom visible four item labeled icon menu'>" + "<a class='item' href='/'>" + "<i class='home icon'></i>" + "Home" + "</a>" + "<a class='item' href='about'>" + "<i class='info icon'></i>" + "Sobre" + "</a>" + "<a class='item' href='dashboard'>" + "<i class='desktop icon'></i>" + "Dashboard" + "</a>" + "<a class='item' href='/contact'>" + "<i class='mail outline icon'></i>" + "Contato" + "</a>" + "</nav>";

        mainElement.insertAdjacentHTML('beforebegin', mysnippet);
    }
    // resize content to match window size
    else {

            resizeMain();

            // Resize content
            window.addEventListener('resize', function (event) {
                resizeMain();
            });
        }
});

///////////////////////////////////////////////////////////////////////////////
//                              Helper Functions                             //
///////////////////////////////////////////////////////////////////////////////

function isMobile(windowInnerWidth) {
    if (windowInnerWidth < '768') {
        return 1;
    }
    return 0;
}

// formula so main matches window size minus sidebar
function resizeMain() {
    mainElement.style.width = window.innerWidth - sidebarSize + 'px';
}

// fetch post from "/post/json/<id>"
// and returns promise
function postGetJson(postId) {

    var parameters = {
        postid: postId
    };

    return fetch(Flask.url_for('getJsonPost', parameters)).then(function (response) {
        return response.json();
    }, function (err) {
        throw new Error('Server response was not ok');
    });
}

// send json
// and returns answer as a promise and logs
function sendJson(flasklocation, settingsObj) {

    return fetch(Flask.url_for(flasklocation), settingsObj).then(function (response) {
        return response;
    }).catch(function (err) {
        // trata se alguma das promises falhar
        console.error('Failed retrieving information', err);
    });
}

// toggle any amount of classes on the element
function toggleClasses(element, classes) {
    // i = 0 is the element
    for (var i = 1; i < arguments.length; i++) {
        element.classList.toggle(arguments[i]);
    }
}

// returns a promise when time has passed
function delay(t) {
    return new Promise(function (resolve) {
        setTimeout(resolve, t);
    });
}