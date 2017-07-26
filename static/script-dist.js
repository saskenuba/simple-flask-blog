"use strict";

var sidebarSize = document.getElementById("sidebar").offsetWidth;
var mainElement = document.getElementById("main");

// Resize content
window.addEventListener('resize', function (event) {
    // content should be total window size - sidebarsize
    mainElement.style.width = window.innerWidth - sidebarSize + 'px';
});