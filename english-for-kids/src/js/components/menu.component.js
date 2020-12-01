export class MenuComponents {
  constructor(data) {
    this.listData = data;
  }

  createMenu() {
    return (
      `<header class="main-header">
  <div class="main-header__wrapper">
    <div class="modal-background"></div>
    <a class="nav-toggle" title="Open/Close menu">
      <span></span>
      <span></span>
      <span></span>
    </a>
    <nav>
      <ul class="main-header__menu-list">

      </ul>
    </nav>
  </div>
</header>`
    );
  }

  createMenuItem(menuItem) {
    return (
      `        <li class="main-header__menu-list__item"><div data-id="${menuItem}"><a
          class="main-header__menu-list__item__link"  id="${menuItem}">${menuItem}</a></li>`
    );
  }

  createSwitcher() {
    return (
      `<div class="on-off-toggle">
  <input class="on-off-toggle__input" type="checkbox" id="bopis" />
  <label for="bopis" class="on-off-toggle__slider"></label>
</div>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  init() {
    const container = document.querySelector('body');
    this.render(container, this.createMenu(), 'afterbegin');
    const mainHeader = document.querySelector('.main-header__wrapper');
    this.render(mainHeader, this.createSwitcher());
    const menuContainer = document.querySelector('.main-header__menu-list');
    this.listData.map((it) => {
      this.render(menuContainer, this.createMenuItem(it));
    });
    const hamburgerButton = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav');
    const navMenuLink = document.querySelectorAll('nav a');
    const modalBackground = document.querySelector('.modal-background');

    const closeNav = () => {
      navMenu.classList.add('closed');
      document.querySelector('html').style.overflow = 'visible';
      setTimeout(() => {
        navMenu.classList.remove('collapse');
        navMenu.classList.remove('closed');
        hamburgerButton.classList.remove('open');
        modalBackground.classList.remove('modal-background-show');
      }, 199);
    };

    hamburgerButton.addEventListener('click', () => {
      if (navMenu.classList.contains('collapse')) {
        closeNav();
      } else {
        hamburgerButton.classList.add('open');
        navMenu.classList.add('collapse');
        modalBackground.classList.add('modal-background-show');
        document.querySelector('html').style.overflow = 'hidden';
      }
    });

    navMenuLink.forEach((link) => {
      link.addEventListener('click', (e) => {
        navMenuLink.forEach((it) => {
          it.classList.remove('main-header__menu-list__item__link--active');
        });
        const activeItem = document.getElementById(`${e.target.getAttribute('id')}`);
        activeItem.classList.add('main-header__menu-list__item__link--active');
        closeNav();
      });
    });

    modalBackground.addEventListener('click', closeNav);
  }
}
