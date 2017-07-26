window.addEventListener('load', function() {

    // selects parent of 3 tabs
    let dashboardMenu = document.getElementById('dashboardmenu');

    // set event of click
    dashboardMenu.addEventListener('click', function(event) {
        event.target.classList.toggle('active');
    });
});
