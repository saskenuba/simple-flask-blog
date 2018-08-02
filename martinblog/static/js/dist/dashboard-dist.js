'use strict';

/// <reference path="./helper.ts" />
//import * as _ from 'lodash';
var Form = /** @class */function () {
    function Form(title, imagelink, content, tags) {
        this.settings = {
            method: null,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: Form
        };
        this.title = title;
        this.imagelink = imagelink;
        this.content = content;
        this.tags = tags;
    }
    Object.defineProperty(Form.prototype, "json", {
        get: function get() {
            return JSON.stringify({
                title: this.title,
                imagelink: this.imagelink,
                content: this.content,
                tags: this.tags
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "httpMethod", {
        set: function set(method) {
            this.settings['method'] = method;
        },
        enumerable: true,
        configurable: true
    });
    Form.prototype.send = function () {
        // TODO:
    };
    return Form;
}();
window.addEventListener('load', function () {
    document.getElementById('dashboardMainMenu').addEventListener('click', function (event) {
        console.log(event);
        workingMainMenu(event);
    });
    var dashboardPostMenu = document.getElementById('dashboardPostMenu');
    var dashboardPortfolioMenu = document.getElementById('dashboardPortfolioMenu');
    var dashboardUserMenu = document.getElementById('dashboardUserMenu');
    dashboardPostMenu.addEventListener('click', function (event) {
        workingSubMenu('a', 'div', 'posts', event.target.dataset.posts);
    });
    dashboardPortfolioMenu.addEventListener('click', function (event) {
        workingSubMenu('a', 'div', 'portfolio', event.target.dataset.portfolio);
    });
});
///////////////////////////////////////////////////////////////////////////////
//                                  Add Form                                 //
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
    var formReady = new Form(titleAddPost.value, imageAddPost.value, editor_add.getData(), tagsAddPost.value).json;
    var settings = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: formReady
    };
    // message link
    var successLink = document.getElementById('form-add-message-success');
    var serverResponse = sendJson('addPost', settings);
    serverResponse.then(function (response) {
        if (response.status == 201) {
            return response.json();
        } else {
            return 'perdeu playba';
        }
    }).then(function (response) {
        // insert links to message
        successLink.href = response['link'];
        successLink.textContent = 'Permalink para o post: ' + response['link'];
        // disable button
        var submitButton = document.getElementById('post-submitbutton-add');
        submitButton.classList.add('disabled');
        var popup = document.getElementById('add-success');
        toggleClasses(popup, 'on', 'off', 'animated', 'fadeIn');
    });
}, false);
///////////////////////////////////////////////////////////////////////////////
//                                 Edit Form                                 //
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
        titleEditPost.value = response.title;
        imageEditPost.value = response.imagelink;
        tagsEditPost.value = response.tags;
        // variable is set at dashboard script tag
        // this sets content of editor based on the response content
        editor_edit.setData(response.content);
    });
});
editForm.addEventListener('submit', function (event) {
    // prevent submit
    event.preventDefault();
    var formReady = new Form(titleEditPost.value, imageEditPost.value, editor_edit.getData(), tagsEditPost.value).json;
    var settings = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: formReady
    };
    // message link
    var successLink = document.getElementById('form-edit-message-success');
    var serverResponse = sendJsonWithObj('editPost', {
        "postid": idEditPost.value
    }, settings);
    serverResponse.then(function (response) {
        if (response.status == 202) {
            return response.json();
        } else return console.log('perdeu playba');
    }).then(function (response) {
        // insert links to message
        successLink.href = response['link'];
        successLink.textContent = 'Permalink para o post: ' + response['link'];
        // disable button
        var submitButton = document.getElementById('post-submitbutton-edit');
        submitButton.classList.add('disabled');
        var popup = document.getElementById('edit-success');
        toggleClasses(popup, 'on', 'off', 'animated', 'fadeIn');
    });
}, false);
///////////////////////////////////////////////////////////////////////////////
//                                Delete Form                                //
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
        } else return 'perdeu playba';
    }).then(function (response) {
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
    parentSiblings.matches.forEach(function (element) {
        return element.classList.add('active');
    });
    parentSiblings.unmatched.forEach(function (element) {
        return element.classList.remove('active');
    });
    childrenSiblings.matches.forEach(function (element) {
        return element.classList.add('on');
    });
    childrenSiblings.unmatched.forEach(function (element) {
        return element.classList.remove('on');
    });
}
function workingMainMenu(event) {
    var relatedSections = getElementbyTagNameWithDataAttributeAll('div', 'dashboardsection', event.target.dataset.dashboardsection);
    var parentSiblings = getElementbyTagNameWithDataAttributeAll('a', 'dashboardsection', event.target.dataset.dashboardsection);
    parentSiblings.matches.forEach(function (element) {
        return element.classList.add('active');
    });
    parentSiblings.unmatched.forEach(function (element) {
        return element.classList.remove('active');
    });
    relatedSections.matches.forEach(function (element) {
        return element.classList.remove('off');
    });
    relatedSections.unmatched.forEach(function (element) {
        return element.classList.add('off');
    });
}
//# sourceMappingURL=dashboard.js.map