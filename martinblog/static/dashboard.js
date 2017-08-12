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

    // All these selectors refer to the divs, not the tabs
    let addMenu = document.getElementById('dashadd');
    let editMenu = document.getElementById('dashedit');
    let delMenu = document.getElementById('dashdel');

    // selects parent of 3 tabs
    let dashboardMenu = document.getElementById('dashboardmenu');

    // select children of tab items
    let dashboardItems = document.getElementById('dashboarditems');

    // on click
    dashboardMenu.addEventListener('click', function(event) {

        // remove active class for every chashboard/martinildren
        Array.from(dashboardMenu.children).forEach(function(el) {
            el.classList.remove('active');
        });

        // remove on class for active menu item
        Array.from(dashboardItems.children).forEach(function(el) {
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
