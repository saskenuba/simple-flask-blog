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
        }
        else if (event.target.id == 'edit') {
            document.getElementById('dashedit').classList.add('on');
        }
        else if (event.target.id == 'del') {
            document.getElementById('dashdel').classList.add('on');
        }
    });
});
