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
//                             Testing Ajax calls                            //
///////////////////////////////////////////////////////////////////////////////

// using jsglue to request flask
var parameters = {
    number: 'all'
};

//fetch(Flask.url_for('getJsonPost', parameters)).then(function(response) {
//    return response.json();
//})
//    .then(function(jsonObject) {
//        console.log(jsonObject);
//    });


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