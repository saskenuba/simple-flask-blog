class Form {
    constructor(id, title, content, apiheader) {
        self.id = id;
        self.title = title;
        self.content = content;
        self.apiheader = apiheader;
    }

    get json() {
        return JSON.stringify({
            header: self.apiheader,
            id: self.id,
            title: self.title,
            content: self.content
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

        // remove active class for every children
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
//                                 Edit Form                                 //
///////////////////////////////////////////////////////////////////////////////

let idEditPost = document.getElementById('post-id-edit');
let titleEditPost = document.getElementById('post-title-edit');
let contentEditPost = document.getElementById('post-content-edit');
let editForm = document.getElementById('form-edit');


// listen for changes on inputs
idEditPost.addEventListener('input', function(event) {

    let postJson = postGetJson(event.target.value);
    postJson.then(function(response) {
        console.log(response);
        titleEditPost.value = response.title;

        // variable is set at dashboard script tag
        // this sets content of editor based on the response content
        editor_edit.setData(response.content);
    });
});

editForm.addEventListener('submit', function(event) {

    // prevent submit
    event.preventDefault();

    let formReady = new Form(idEditPost.value, titleEditPost.value, editor_edit.getData(), 'edit');

    $('#edit-success')
        .transition({
            animation  : 'scale',
            duration   : '2s'
        })
    ;

    ;

}, false);

///////////////////////////////////////////////////////////////////////////////
//                                  Add Form                                 //
///////////////////////////////////////////////////////////////////////////////
