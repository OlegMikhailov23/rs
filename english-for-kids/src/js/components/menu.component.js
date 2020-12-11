import markup from '../markup/markup';
import render from '../helper/helper.render';

class MenuComponents {
  constructor() {
    this.container = null;
  }

  setContainer(el) {
    this.container = el;
  }

  setHumburger() {
    this.humburger = document.querySelector('.nav-toggle');
  }

  setMenu() {
    this.menu = document.querySelector('nav');
  }

  setBackground() {
    this.background = document.querySelector('.modal-background');
  }

  closeNav() {
    this.menu.classList.add('closed');
    document.querySelector('html').style.overflow = 'visible';
    setTimeout(() => {
      this.menu.classList.remove('collapse');
      this.menu.classList.remove('closed');
      this.humburger.classList.remove('open');
      this.background.classList.remove('modal-background-show');
    }, 199);
  }

  openNav() {
    if (this.menu.classList.contains('collapse')) {
      this.closeNav();
    } else {
      this.humburger.classList.add('open');
      this.menu.classList.add('collapse');
      this.background.classList.add('modal-background-show');
      document.querySelector('html').style.overflow = 'hidden';
    }
  }

  activateLink() {
    const navMenuLink = document.querySelectorAll('nav a');
    navMenuLink.forEach((link) => {
      link.addEventListener('click', (el) => {
        navMenuLink.forEach((it) => {
          it.classList.remove('main-header__menu-list__item__link--active');
        });
        const activeItem = document.getElementById(`${el.target.getAttribute('id')}`);
        activeItem.classList.add('main-header__menu-list__item__link--active');
        this.closeNav();
      });
    });
  }

  navBehavior() {
    this.setHumburger();
    this.setMenu();
    this.setBackground();
    this.setContainer(this.menu);
    this.closeNav();
    this.humburger.addEventListener('click', () => {
      this.openNav();
    });

    this.activateLink();

    this.background.addEventListener('click', this.closeNav.bind(this));
  }

  init(data) {
    const container = document.querySelector('body');
    render(container, markup.markupMenu.createMenu());
    const mainHeader = document.querySelector('.main-header__wrapper');
    render(mainHeader, markup.markupMenu.createSwitcher());
    const menuContainer = document.querySelector('.main-header__menu-list');
    data.forEach((it) => {
      render(menuContainer, markup.markupMenu.createMenuItem(it));
    });
    this.navBehavior();
  }
}

export default MenuComponents;
