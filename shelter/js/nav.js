'use strict';

const hamburgerButton = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav');
const navMenuLink = document.querySelectorAll('nav a');
const modalBackground = document.querySelector('.modal-background');
const headerLogo = document.querySelector('.main-header__logo');

const closeNav = () => {
    navMenu.classList.add('closed');
    headerLogo.style.width = 'auto';
    headerLogo.style.height = 'auto';
    document.querySelector('html').style.overflow = 'visible';
    setTimeout(() => {
        navMenu.classList.remove('collapse');
        navMenu.classList.remove('closed');
        hamburgerButton.classList.remove('open');
        modalBackground.classList.remove('modal-background-show');
        headerLogo.style.opacity = '1';
    }, 199)
}

hamburgerButton.addEventListener('click', (evt) => {
    if (navMenu.classList.contains('collapse')) {
        closeNav();
    } else {
        hamburgerButton.classList.add('open');
        navMenu.classList.add('collapse');
        modalBackground.classList.add('modal-background-show');
        document.querySelector('html').style.overflow = 'hidden';
        headerLogo.style.opacity = '0';
        headerLogo.style.width = '0';
        headerLogo.style.height = '0';
    }
})

navMenuLink.forEach((link) => {
    link.addEventListener('click', closeNav)
});

modalBackground.addEventListener('click', closeNav);
