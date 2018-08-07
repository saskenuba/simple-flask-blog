/// <reference path="./helper.ts" />
/// <reference path="./definitions.ts" />
//import * as _ from 'lodash';
window.addEventListener('load', function () {
    document.getElementById('dashboardMainMenu').addEventListener('click', function (event) {
        workingMainMenu(event);
    });
    var dashboardPostMenu = document.getElementById('dashboardPostMenu');
    var dashboardPortfolioMenu = document.getElementById('dashboardPortfolioMenu');
    var dashboardUserMenu = document.getElementById('dashboardUserMenu');
    dashboardPostMenu.addEventListener('click', function (event) {
        workingSubMenu('a', 'div', 'posts', event.target['dataset'].posts);
    });
    dashboardPortfolioMenu.addEventListener('click', function (event) {
        workingSubMenu('a', 'div', 'portfolio', event.target['dataset'].portfolio);
    });
    var portfolioItemAdd = new PortfolioItem(document.getElementById('portfolio-add'), editor_portfolio_add);
    portfolioItemAdd.httpMethod = "POST";
    document.getElementById('portfolio-add-buttons').addEventListener('click', portfolioItemAdd.pageHandler);
    document.getElementById('portfolio-add-submit').addEventListener('click', function (event) {
        portfolioItemAdd.submitHandler(event);
    });
    var portfolioItemEdit = new PortfolioItem(document.getElementById('portfolio-edit'), editor_portfolio_edit);
    portfolioItemEdit.httpMethod = "PUT";
    $('#select-edit')
        .dropdown({
        onChange: function (value, text, $selectedItem) {
            portfolioItemEdit.retrieve(value);
        }
    });
    document.getElementById('portfolio-edit-buttons').addEventListener('click', portfolioItemEdit.pageHandler);
    document.getElementById('portfolio-edit-submit').addEventListener('click', function (event) {
        portfolioItemEdit.submitHandler(event);
    });
    var portfolioItemDel = new PortfolioItem(document.getElementById('portfolio-del'));
    portfolioItemDel.httpMethod = "DELETE";
    $('#select-del')
        .dropdown({
        onChange: function (value, text, $selectedItem) {
            portfolioItemDel.retrieve(value);
        }
    });
    document.getElementById('portfolio-del-submit').addEventListener('click', function (event) {
        portfolioItemDel.submitHandler(event);
    });
});
///////////////////////////////////////////////////////////////////////////////
//                                  Add Post                                 //
///////////////////////////////////////////////////////////////////////////////
var titleAddPost = document.getElementById('post-title-add');
var contentAddPost = document.getElementById('post-content-add');
var imageAddPost = document.getElementById('post-image-add');
var tagsAddPost = document.getElementById('post-tags-add');
var addForm = document.getElementById('form-add');
addForm.addEventListener('submit', function (event) {
    // prevent submit
    event.preventDefault();
    // gathering form data to be submited
    var formReady = new Post(titleAddPost.value, imageAddPost.value, editor_add.getData(), tagsAddPost.value);
    formReady.httpMethod = "POST";
    formReady.settings['body'] = formReady.json;
    // message link
    var successLink = document.getElementById('form-add-message-success');
    var serverResponse = formReady.send('addPost');
    serverResponse.then(function (response) {
        if (response.status == 201) {
            return response.json();
        }
        else {
            return 'perdeu playba';
        }
    })
        .then(function (response) {
        // disable submit button, then append message at end of page
        var submitButton = document.getElementById('post-submitbutton-add');
        var messageElement = document.getElementById('add-success');
        appendMessage(successLink, messageElement, response['link'], submitButton);
    });
}, false);
///////////////////////////////////////////////////////////////////////////////
//                                 Edit Post                                 //
///////////////////////////////////////////////////////////////////////////////
var idEditPost = document.getElementById('post-id-edit');
var titleEditPost = document.getElementById('post-title-edit');
var contentEditPost = document.getElementById('post-content-edit');
var imageEditPost = document.getElementById('post-image-edit');
var tagsEditPost = document.getElementById('post-tags-edit');
var editForm = document.getElementById('form-edit');
// listen for changes on inputs
idEditPost.addEventListener('input', function (event) {
    var postJson = postGetJson(event.target.value);
    postJson.then(function (response) {
        titleEditPost.value = response['title'];
        imageEditPost.value = response['imagelink'];
        tagsEditPost.value = response['tags'];
        // variable is set at dashboard script tag
        // this sets content of editor based on the response content
        editor_edit.setData(response.content);
    });
});
editForm.addEventListener('submit', function (event) {
    // prevent submit
    event.preventDefault();
    var formReady = new Post(titleEditPost.value, imageEditPost.value, editor_edit.getData(), tagsEditPost.value);
    formReady.httpMethod = "PUT";
    formReady.settings['body'] = formReady.json;
    // message link
    var successLink = document.getElementById('form-edit-message-success');
    var serverResponse = sendJsonWithObj('editPost', {
        "postid": idEditPost.value
    }, formReady.settings);
    serverResponse.then(function (response) {
        if (response.status == 202) {
            return response.json();
        }
        else
            return console.log('perdeu playba');
    })
        .then(function (response) {
        // disable button and append message
        var submitButton = document.getElementById('post-submitbutton-edit');
        var messageElement = document.getElementById('edit-success');
        appendMessage(successLink, messageElement, response['link'], submitButton);
    });
}, false);
///////////////////////////////////////////////////////////////////////////////
//                                Delete Post                                //
///////////////////////////////////////////////////////////////////////////////
var idDelPost = document.getElementById('post-id-del');
var titleDelPost = document.getElementById('post-title-del');
// listen for changes on inputs
idDelPost.addEventListener('input', function (event) {
    var postJson = postGetJson(event.target.value);
    postJson.then(function (response) {
        titleDelPost.value = response.title;
    });
});
var delForm = document.getElementById('form-del');
delForm.addEventListener('submit', function (event) {
    // prevent submit
    event.preventDefault();
    var settings = {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };
    // message link
    var successLink = document.getElementById('form-del-message-success');
    var serverResponse = sendJsonWithObj('deletePost', {
        "postid": idDelPost.value
    }, settings);
    serverResponse.then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
        else
            return 'perdeu playba';
    })
        .then(function (response) {
        // disable button
        var submitButton = document.getElementById('post-submitbutton-del');
        submitButton.classList.add('disabled');
        var popup = document.getElementById('del-success');
        toggleClasses(popup, 'on', 'off', 'animated', 'fadeIn');
    });
}, false);
function workingSubMenu(parentTag, childrenTag, dataAttribute, dataAttributeValue) {
    var childrenSiblings = getElementbyTagNameWithDataAttributeAll(childrenTag, dataAttribute, dataAttributeValue);
    var parentSiblings = getElementbyTagNameWithDataAttributeAll(parentTag, dataAttribute, dataAttributeValue);
    parentSiblings.matches.forEach(function (element) { return element.classList.add('active'); });
    parentSiblings.unmatched.forEach(function (element) { return element.classList.remove('active'); });
    childrenSiblings.matches.forEach(function (element) { return element.classList.add('on'); });
    childrenSiblings.unmatched.forEach(function (element) { return element.classList.remove('on'); });
}
function workingMainMenu(event) {
    var relatedSections = getElementbyTagNameWithDataAttributeAll('div', 'dashboardsection', event.target.dataset.dashboardsection);
    var parentSiblings = getElementbyTagNameWithDataAttributeAll('a', 'dashboardsection', event.target.dataset.dashboardsection);
    parentSiblings.matches.forEach(function (element) { return element.classList.add('active'); });
    parentSiblings.unmatched.forEach(function (element) { return element.classList.remove('active'); });
    relatedSections.matches.forEach(function (element) { return element.classList.remove('off'); });
    relatedSections.unmatched.forEach(function (element) { return element.classList.add('off'); });
}
function appendMessage(anchorElement, messageElement, responseSuccessLink, submitButtom) {
    anchorElement['href'] = responseSuccessLink;
    anchorElement.textContent = 'Permalink para o post: ' + responseSuccessLink;
    submitButtom.classList.add('disabled');
    toggleClasses(messageElement, 'on', 'off', 'animated', 'fadeIn');
}
//# sourceMappingURL=dashboard.js.map
//# sourceMappingURL=dashboard-dist.js.map