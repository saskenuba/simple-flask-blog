'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Form = function () {
    function Form(title, imagelink, content, tags) {
        _classCallCheck(this, Form);

        self.title = title;
        self.imagelink = imagelink;
        self.content = content;
        self.tags = tags;
    }

    _createClass(Form, [{
        key: 'json',
        get: function get() {
            return JSON.stringify({
                title: self.title,
                imagelink: self.imagelink,
                content: self.content,
                tags: self.tags
            });
        }
    }]);

    return Form;
}();

window.addEventListener('load', function () {

    // All these selectors refer to the divs, not the tabs
    var addMenu = document.getElementById('dashadd');
    var editMenu = document.getElementById('dashedit');
    var delMenu = document.getElementById('dashdel');

    // selects parent of 3 tabs
    var dashboardMenu = document.getElementById('dashboardmenu');

    // select children of tab items
    var dashboardItems = document.getElementById('dashboarditems');

    // on click
    dashboardMenu.addEventListener('click', function (event) {

        // remove active class for every chashboard/martinildren
        Array.from(dashboardMenu.children).forEach(function (el) {
            el.classList.remove('active');
        });

        // remove on class for active menu item
        Array.from(dashboardItems.children).forEach(function (el) {
            el.classList.remove('on');
        });

        // and activate only at the clicked one
        event.target.classList.add('active');

        if (event.target.id == 'add') {
            document.getElementById('dashadd').classList.add('on');
        } else if (event.target.id == 'edit') {
            document.getElementById('dashedit').classList.add('on');
        } else if (event.target.id == 'del') {
            document.getElementById('dashdel').classList.add('on');
        }
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