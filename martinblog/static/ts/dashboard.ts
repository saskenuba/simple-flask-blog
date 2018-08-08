/// <reference path="./helper.ts" />
/// <reference path="./definitions.ts" />

//import * as _ from 'lodash';

window.addEventListener('load', function() {


    document.getElementById('dashboardMainMenu').addEventListener('click', event => {
        workingMainMenu(event);
    });

    let dashboardPostMenu = document.getElementById('dashboardPostMenu');
    let dashboardPortfolioMenu = document.getElementById('dashboardPortfolioMenu');
    let dashboardUserMenu = document.getElementById('dashboardUserMenu');

    dashboardPostMenu.addEventListener('click', function(event) {
        workingSubMenu('a', 'div', 'posts', event.target['dataset'].posts);
    });

    dashboardPortfolioMenu.addEventListener('click', function(event) {
        workingSubMenu('a', 'div', 'portfolio', event.target['dataset'].portfolio);
    });

    const portfolioItemAdd = new PortfolioItem(document.getElementById('portfolio-add'), editor_portfolio_add);
    portfolioItemAdd.httpMethod = "POST";
    portfolioItemAdd.messageElement = document.getElementById('portfolio-add-message-success');
    document.getElementById('portfolio-add-buttons').addEventListener('click', portfolioItemAdd.pageHandler);
    document.getElementById('portfolio-add-submit').addEventListener('click', (event) => {
        portfolioItemAdd.submitHandler(event)
    });

    const portfolioItemEdit = new PortfolioItem(document.getElementById('portfolio-edit'), editor_portfolio_edit);
    portfolioItemEdit.httpMethod = "PUT";
    portfolioItemEdit.messageElement = document.getElementById('portfolio-edit-message-success');
    $('#select-edit')
        .dropdown({
            onChange: function(value, text, $selectedItem) {
                portfolioItemEdit.retrieve(value);
            }
        });
    document.getElementById('portfolio-edit-buttons').addEventListener('click', portfolioItemEdit.pageHandler);
    document.getElementById('portfolio-edit-submit').addEventListener('click', (event) => {
        portfolioItemEdit.submitHandler(event)
    });

    const portfolioItemDel = new PortfolioItem(document.getElementById('portfolio-del'));
    portfolioItemDel.httpMethod = "DELETE";
    portfolioItemDel.messageElement = document.getElementById('portfolio-del-message-success');
    $('#select-del')
        .dropdown({
            onChange: function(value, text, $selectedItem) {
                portfolioItemDel.retrieve(value);
            }
        });
    document.getElementById('portfolio-del-submit').addEventListener('click', (event) => {
        portfolioItemDel.submitHandler(event)
    });

});


///////////////////////////////////////////////////////////////////////////////
//                                  Add Post                                 //
///////////////////////////////////////////////////////////////////////////////

let titleAddPost = document.getElementById('post-title-add');
let contentAddPost = document.getElementById('post-content-add');
let imageAddPost = document.getElementById('post-image-add');
let tagsAddPost = document.getElementById('post-tags-add');
let addForm = document.getElementById('form-add');

addForm.addEventListener('submit', function(event) {

    // prevent submit
    event.preventDefault();

    // gathering form data to be submited
    const formReady = new Post(titleAddPost.value, imageAddPost.value, editor_add.getData(), tagsAddPost.value);
    formReady.httpMethod = "POST";
    formReady.settings['body'] = formReady.json;

    // message link
    let successLink = document.getElementById('form-add-message-success');

    let serverResponse: Promise<Response> = formReady.send('addPost');
    serverResponse.then(function(response) {
        if (response.status == 201) {
            return response.json();
        } else {
            return 'perdeu playba';
        }
    })

        .then(function(response) {

            // disable submit button, then append message at end of page
            let submitButton = document.getElementById('post-submitbutton-add');
            let messageElement = document.getElementById('add-success');
            appendMessage(successLink, messageElement, response['link'], submitButton)
        });

}, false);

///////////////////////////////////////////////////////////////////////////////
//                                 Edit Post                                 //
///////////////////////////////////////////////////////////////////////////////

let idEditPost = <HTMLInputElement>document.getElementById('post-id-edit');
let titleEditPost = <HTMLInputElement>document.getElementById('post-title-edit');
let contentEditPost = <HTMLInputElement>document.getElementById('post-content-edit');
let imageEditPost = <HTMLInputElement>document.getElementById('post-image-edit');
let tagsEditPost = <HTMLInputElement>document.getElementById('post-tags-edit');
let editForm = document.getElementById('form-edit');


// listen for changes on inputs
idEditPost.addEventListener('input', function(event) {

    let postJson: Promise<Response> = postGetJson(event.target.value);
    postJson.then(function(response) {
        titleEditPost.value = response['title'];
        imageEditPost.value = response['imagelink'];
        tagsEditPost.value = response['tags'];

        // variable is set at dashboard script tag
        // this sets content of editor based on the response content
        editor_edit.setData(response.content);
    });
});

editForm.addEventListener('submit', function(event) {

    // prevent submit
    event.preventDefault();

    let formReady = new Post(titleEditPost.value, imageEditPost.value, editor_edit.getData(), tagsEditPost.value);
    formReady.httpMethod = "PUT";
    formReady.settings['body'] = formReady.json;

    // message link
    let successLink = document.getElementById('form-edit-message-success');

    let serverResponse = sendJsonWithObj('editPost', {
        "postid": idEditPost.value
    }, formReady.settings);
    serverResponse.then(function(response) {
        if (response.status == 202) {
            return response.json();
        } else
            return console.log('perdeu playba');
    })

        .then(function(response) {

            // disable button and append message
            let submitButton = document.getElementById('post-submitbutton-edit');
            let messageElement = document.getElementById('edit-success');
            appendMessage(successLink, messageElement, response['link'], submitButton)
        });

}, false);

///////////////////////////////////////////////////////////////////////////////
//                                Delete Post                                //
///////////////////////////////////////////////////////////////////////////////

const idDelPost = document.getElementById('post-id-del');
const titleDelPost = document.getElementById('post-title-del');

// listen for changes on inputs
idDelPost.addEventListener('input', function(event) {

    let postJson = postGetJson(event.target.value);
    postJson.then(function(response) {
        titleDelPost.value = response.title;
    });
});

let delForm = document.getElementById('form-del');
delForm.addEventListener('submit', function(event) {

    // prevent submit
    event.preventDefault();

    const settings = {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    // message link
    let successLink = document.getElementById('form-del-message-success');

    let serverResponse = sendJsonWithObj('deletePost', {
        "postid": idDelPost.value
    }, settings);
    serverResponse.then(function(response) {
        if (response.status == 200) {
            return response.json();
        } else
            return 'perdeu playba';
    })

        .then(function(response) {

            // disable button
            let submitButton = document.getElementById('post-submitbutton-del');
            submitButton.classList.add('disabled');

            let popup = document.getElementById('del-success');
            toggleClasses(popup, 'on', 'off', 'animated', 'fadeIn');
        });

}, false);

function workingSubMenu(parentTag, childrenTag, dataAttribute, dataAttributeValue) {

    let childrenSiblings = getElementbyTagNameWithDataAttributeAll(childrenTag, dataAttribute, dataAttributeValue);
    let parentSiblings = getElementbyTagNameWithDataAttributeAll(parentTag, dataAttribute, dataAttributeValue);
    parentSiblings.matches.forEach((element: HTMLElement) => element.classList.add('active'));
    parentSiblings.unmatched.forEach((element: HTMLElement) => element.classList.remove('active'));
    childrenSiblings.matches.forEach((element: HTMLElement) => element.classList.add('on'));
    childrenSiblings.unmatched.forEach((element: HTMLElement) => element.classList.remove('on'));

}

function workingMainMenu(event) {

    let relatedSections = getElementbyTagNameWithDataAttributeAll('div', 'dashboardsection', event.target.dataset.dashboardsection);
    let parentSiblings = getElementbyTagNameWithDataAttributeAll('a', 'dashboardsection', event.target.dataset.dashboardsection);
    parentSiblings.matches.forEach((element: HTMLElement) => element.classList.add('active'));
    parentSiblings.unmatched.forEach((element: HTMLElement) => element.classList.remove('active'));
    relatedSections.matches.forEach((element: HTMLElement) => element.classList.remove('off'));
    relatedSections.unmatched.forEach((element: HTMLElement) => element.classList.add('off'));
}

function appendMessage(anchorElement: HTMLElement, messageElement: HTMLElement, responseSuccessLink: Response, submitButtom: HTMLElement) {

    anchorElement['href'] = responseSuccessLink;
    anchorElement.textContent = 'Permalink para o post: ' + responseSuccessLink;
    submitButtom.classList.add('disabled');
    toggleClasses(messageElement, 'on', 'off', 'animated', 'fadeIn');

}
