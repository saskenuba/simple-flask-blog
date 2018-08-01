/// <reference path="./helper.ts" />

const navigationBar: HTMLElement = document.getElementById('navigationBar');

window.onload = () => {

    let nextSelection;

    navigationBar.addEventListener('click', function(ev) {

        Array.from(navigationBar.children, element => element.classList.remove('active'));
        toggleClasses(ev.target, 'active');

        nextSelection = getElementbyTagNameWithDataAttribute('div', 'page', ev.target['dataset'].page).scrollIntoView({
            behavior: 'smooth'
        });

    });
}
