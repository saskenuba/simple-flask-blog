/// <reference path="./helper.ts" />

window.addEventListener('load', function() {
    let internalCounter = 0;
    const queryLimit = 3;

    const articleParent = document.getElementById('main');
    const buttonShowMore = document.getElementById('showMore');
    const buttonShowMoreContainer = document.getElementById('showMoreContainer');

    buttonShowMore.addEventListener('click', function(el) {

        toggleClasses(buttonShowMore, 'loading');
        internalCounter++;
        let queryOffset = 3 * internalCounter;

        let getPosts = postGetJson(undefined, queryOffset, queryLimit);
        getPosts.then(response => {
            toggleClasses(buttonShowMore, 'loading');
            let appendedIDs = appendPosts(response, articleParent);
            let firstAppendedID = appendedIDs[0];

            // then reposition button
            articleParent.appendChild(buttonShowMoreContainer);

            delay(200).then(function() {
                document.getElementById(firstAppendedID).scrollIntoView({
                    behavior: 'smooth'
                });
            });

            delay(1000).then(function() {
                appendedIDs.forEach(function(elem) {
                    const currentPost = document.getElementById(elem);
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

    let idSaver = [];

    entriesArray.forEach(function(elem) {
        idSaver.push('post' + elem.id);

        //Object.keys(elem.tags).map(key => console.log(elem.tags[key]));

        const template =
            `<article id="${'post'+elem.id}" class="ui basic attached segment hidden blog-post">
        <div class="ui red ribbon label">Tags:
        ${Object.keys(elem.tags).map(key =>
         "<a href=" + Flask.url_for('tags', {'string': elem.tags[key]}) + ">" +elem.tags[key]+ "</a>")}
    </div>
        <h2 class="ui header"> ${elem.title}
        <div class="sub header">Postado ${elem.timestamp[3].toLowerCase()}, ${elem.timestamp[0]} de ${elem.timestamp[1]}, ${elem.timestamp[2]}</div>
        </h2>
        <img class="ui fluid image" src="${elem.imagelink}" />
        <p>${elem.content.substring(0, 600)}...</p>
        <!-- Keep reading button-->
        <a href="/post/${elem.id}/${elem.slug}">
        <div class="ui darkgreen animated button" tabindex="0">
        <div class="visible content">Continuar Lendo</div>
        <div class="hidden content">
        <i class="right arrow icon"></i>
        </div>
        </div>
        </a>
        <!-- End of button-->
        </article>`;

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
