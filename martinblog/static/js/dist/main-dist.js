'use strict';

/// <reference path="./helper.ts" />
window.addEventListener('load', function () {
    var internalCounter = 0;
    var queryLimit = 3;
    var articleParent = document.getElementById('main');
    var buttonShowMore = document.getElementById('showMore');
    var buttonShowMoreContainer = document.getElementById('showMoreContainer');
    buttonShowMore.addEventListener('click', function (el) {
        toggleClasses(buttonShowMore, 'loading');
        internalCounter++;
        var queryOffset = 3 * internalCounter;
        var getPosts = postGetJson(undefined, queryOffset, queryLimit);
        getPosts.then(function (response) {
            toggleClasses(buttonShowMore, 'loading');
            var appendedIDs = appendPosts(response, articleParent);
            var firstAppendedID = appendedIDs[0];
            // then reposition button
            articleParent.appendChild(buttonShowMoreContainer);
            delay(200).then(function () {
                document.getElementById(firstAppendedID).scrollIntoView({
                    behavior: 'smooth'
                });
            });
            delay(1000).then(function () {
                appendedIDs.forEach(function (elem) {
                    var currentPost = document.getElementById(elem);
                    toggleClasses(currentPost, 'hidden', 'animated', 'fadeIn');
                });
            });
        });
    });
});
/**
 *  This functions accepts an array with entries, and then appends after its siblings.
 * @param {Type of entriesArray} entriesArray - JSON Array of entries
 * @param {Type of elementToAppend} elementToAppend - Parent element which entriesArray should be appended to.
 * @returns {Return Type} Array of strings
 */
function appendPosts(entriesArray, elementToAppend) {
    var idSaver = [];
    entriesArray.forEach(function (elem) {
        idSaver.push('post' + elem.id);
        //Object.keys(elem.tags).map(key => console.log(elem.tags[key]));
        var template = "<article id=\"" + ('post' + elem.id) + "\" class=\"ui basic attached segment hidden blog-post\">\n        <div class=\"ui red ribbon label\">Tags:\n        " + Object.keys(elem.tags).map(function (key) {
            return "<a href=" + Flask.url_for('tags', { 'string': elem.tags[key] }) + ">" + elem.tags[key] + "</a>";
        }) + "\n    </div>\n        <h2 class=\"ui header\"> " + elem.title + "\n        <div class=\"sub header\">Postado " + elem.timestamp[3].toLowerCase() + ", " + elem.timestamp[0] + " de " + elem.timestamp[1] + ", " + elem.timestamp[2] + "</div>\n        </h2>\n        <img class=\"ui fluid image\" src=\"" + elem.imagelink + "\" />\n        <p>" + elem.content.substring(0, 600) + "...</p>\n        <!-- Keep reading button-->\n        <a href=\"/post/" + elem.id + "/" + elem.slug + "\">\n        <div class=\"ui darkgreen animated button\" tabindex=\"0\">\n        <div class=\"visible content\">Continuar Lendo</div>\n        <div class=\"hidden content\">\n        <i class=\"right arrow icon\"></i>\n        </div>\n        </div>\n        </a>\n        <!-- End of button-->\n        </article>";
        elementToAppend.insertAdjacentHTML('beforeend', template);
    });
    return idSaver;
}
/**
 * Returns y position of html object
 * @param {Type of obj} obj - Object to have his y position returned.
 * @returns {Return Type} int
 */
function findPos(obj) {
    /*
     */
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj == obj.offsetParent);
        return [curtop];
    }
}
//# sourceMappingURL=main.js.map
//# sourceMappingURL=main-dist.js.map