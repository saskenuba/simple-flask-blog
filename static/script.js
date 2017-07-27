let sidebarSize = document.getElementById("sidebar").offsetWidth;
let mainElement = document.getElementById("main");

// At page load complete load
window.addEventListener('load', function(event) {

    // if mobile screen size
    if (isMobile(window.innerWidth)) {

        // remove sidebar
        let sidebar = document.getElementById('sidebar');
        sidebar.parentElement.removeChild(sidebar);
    }
    // resize content to match window size
    else {

        resizeMain();

        // Resize content
        window.addEventListener('resize', function(event) {
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
    mainElement.style.width = (window.innerWidth - sidebarSize) + 'px';
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

// send through POST method json
// and returns success or fail
function postSendJson(arg) {

}
