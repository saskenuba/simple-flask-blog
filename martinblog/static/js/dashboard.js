class Form {
    constructor(title, imagelink, content, tags) {
        self.title = title;
        self.imagelink = imagelink;
        self.content = content;
        self.tags = tags;
    }

    get json() {
        return JSON.stringify({
            title: self.title,
            imagelink: self.imagelink,
            content: self.content,
            tags: self.tags
        });
    }
}

window.addEventListener('load', function() {
    document.getElementById('dashboardMainMenu').addEventListener('click', event => {

        workingMainMenu(event);

    });

    let dashboardPostMenu = document.getElementById('dashboardPostMenu');
    let dashboardPortfolioMenu = document.getElementById('dashboardPortfolioMenu');
    let dashboardUserMenu = document.getElementById('dashboardUserMenu');

    dashboardPostMenu.addEventListener('click', function(event) {
        workingSubMenu('a', 'div', 'posts', event.target.dataset.posts);
    });

    dashboardPortfolioMenu.addEventListener('click', function(event) {
        workingSubMenu('a', 'div', 'portfolio', event.target.dataset.portfolio);
    });

});


///////////////////////////////////////////////////////////////////////////////
//                                  Add Form                                 //
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
    const formReady = new Form(titleAddPost.value, imageAddPost.value, editor_add.getData(), tagsAddPost.value).json;

    const settings = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: formReady
    };

    // message link
    let successLink = document.getElementById('form-add-message-success');

    let serverResponse = sendJson('addPost', settings);
    serverResponse.then(function(response) {
            if (response.status == 201) {
                return response.json();
            } else {
                return 'perdeu playba';
            }
        })

        .then(function(response) {

            // insert links to message
            successLink.href = response['link'];
            successLink.textContent = 'Permalink para o post: ' + response['link'];

            // disable button
            let submitButton = document.getElementById('post-submitbutton-add');
            submitButton.classList.add('disabled');

            let popup = document.getElementById('add-success');
            toggleClasses(popup, 'on', 'off', 'animated', 'fadeIn');
        });

}, false);

///////////////////////////////////////////////////////////////////////////////
//                                 Edit Form                                 //
///////////////////////////////////////////////////////////////////////////////

let idEditPost = document.getElementById('post-id-edit');
let titleEditPost = document.getElementById('post-title-edit');
let contentEditPost = document.getElementById('post-content-edit');
let imageEditPost = document.getElementById('post-image-edit');
let tagsEditPost = document.getElementById('post-tags-edit');
let editForm = document.getElementById('form-edit');


// listen for changes on inputs
idEditPost.addEventListener('input', function(event) {

    let postJson = postGetJson(event.target.value);
    postJson.then(function(response) {
        titleEditPost.value = response.title;
        imageEditPost.value = response.imagelink;
        tagsEditPost.value = response.tags;

        // variable is set at dashboard script tag
        // this sets content of editor based on the response content
        editor_edit.setData(response.content);
    });
});

editForm.addEventListener('submit', function(event) {

    // prevent submit
    event.preventDefault();

    let formReady = new Form(titleEditPost.value, imageEditPost.value, editor_edit.getData(), tagsEditPost.value).json;

    const settings = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: formReady
    };

    // message link
    let successLink = document.getElementById('form-edit-message-success');

    let serverResponse = sendJsonWithObj('editPost', {
        "postid": idEditPost.value
    }, settings);
    serverResponse.then(function(response) {
            if (response.status == 202) {
                return response.json();
            } else
                return console.log('perdeu playba');
        })

        .then(function(response) {

            // insert links to message
            successLink.href = response['link'];
            successLink.textContent = 'Permalink para o post: ' + response['link'];

            // disable button
            let submitButton = document.getElementById('post-submitbutton-edit');
            submitButton.classList.add('disabled');

            let popup = document.getElementById('edit-success');
            toggleClasses(popup, 'on', 'off', 'animated', 'fadeIn');
        });

}, false);

///////////////////////////////////////////////////////////////////////////////
//                                Delete Form                                //
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
    parentSiblings.matches.forEach((element) => element.classList.add('active'));
    parentSiblings.unmatched.forEach((element) => element.classList.remove('active'));
    childrenSiblings.matches.forEach((element) => element.classList.add('on'));
    childrenSiblings.unmatched.forEach((element) => element.classList.remove('on'));

}

function workingMainMenu(event) {

    let relatedSections = getElementbyTagNameWithDataAttributeAll('div', 'dashboardsection', event.target.dataset.dashboardsection);
    let parentSiblings = getElementbyTagNameWithDataAttributeAll('a', 'dashboardsection', event.target.dataset.dashboardsection);
    parentSiblings.matches.forEach((element) => element.classList.add('active'));
    parentSiblings.unmatched.forEach((element) => element.classList.remove('active'));
    relatedSections.matches.forEach((element) => element.classList.remove('off'));
    relatedSections.unmatched.forEach((element) => element.classList.add('off'));
}
