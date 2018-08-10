let sidebarSize = document.getElementById("sidebar").offsetWidth;
let mainElement = document.getElementById("main");

const pathAbout = Flask.url_for('about');
const pathContact = Flask.url_for('contact');
const pathPosts = Flask.url_for('blogPosts');

// if mobile screen size
if (isMobile(window.innerWidth)) {

    // remove sidebar
    let sidebar = document.getElementById('sidebar');
    sidebar.parentElement.removeChild(sidebar);

    // add bottombar
    const bottombar = document.createElement('div');
    const mysnippet = "<nav class='ui sidebar inverted darkblue bottom visible four item labeled icon menu'>" +
        "<a class='item' href='/'>" + "<i class='home icon'></i>" + "Home" + "</a>" +
        `<a class='item' href=${pathAbout}>` + "<i class='info icon'></i>" + "Sobre" + "</a>" +
        `<a class='item' href=${pathPosts}>` + "<i class='edit icon'></i>" + "Arquivo" + "</a>" +
        `<a class='item' href='${pathContact}'>` + "<i class='mail outline icon'></i>" + "Contato" + "</a>" + "</nav>";

    mainElement.insertAdjacentHTML('beforebegin', mysnippet);

}

// At page load complete load
window.addEventListener('load', function(event) {

    // resize content to match window size
    resizeMain();

    // Resize content
    window.addEventListener('resize', function(event) {
        resizeMain();
    });
});

// formula so main matches window size minus sidebar
function resizeMain() {
    mainElement.style.width = (window.innerWidth - sidebarSize) + 'px';
}
