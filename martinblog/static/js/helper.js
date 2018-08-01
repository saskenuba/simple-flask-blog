function isMobile(windowInnerWidth) {
    if (windowInnerWidth < '768') {
        return 1;
    }
    return 0;
}

// fetch post from "/post/json/<id>"
// and returns promise
function postGetJson(postId) {

    let parameters = {
        postid: postId
    };

    return fetch(Flask.url_for('getJsonPost', parameters))
        .then(function(response) {
            return response.json();
        }, function(err) {
            throw new Error('Server response was not ok');
        });
}

function postGetJson(postId, offset, limit) {
/*
 * Returns an array with entries
 */
    let parameters = {
        postid: postId,
        offset: offset,
        limit: limit
    };

    return fetch(Flask.url_for('getJsonPost', parameters))
        .then(function(response) {
            return response.json();
        }, function(err) {
            throw new Error('Server response was not ok');
        });
}

// send json
// and returns answer as a promise and logs
function sendJson(flasklocation, settingsObj) {

    return fetch(Flask.url_for(flasklocation), settingsObj)
        .then(response => response)
        .catch(err => {
            // trata se alguma das promises falhar
            console.error('Failed retrieving information', err);
        });
}

// send json, with optional parameter
function sendJsonWithObj(flasklocation, flaskparameter, settingsObj) {
    return fetch(Flask.url_for(flasklocation, flaskparameter), settingsObj)
        .then(response => response)
        .catch(err => {
            // trata se alguma das promises falhar
            console.error('Failed retrieving information', err);
        });
}

// toggle any amount of classes on the element
function toggleClasses(element, classes) {
    // i = 0 is the element
    for (let i = 1; i < arguments.length; i++) {
        element.classList.toggle(arguments[i]);
    }
}

// returns a promise when time has passed
function delay(t) {
    return new Promise(function(resolve) {
        setTimeout(resolve, t);
    });
}
