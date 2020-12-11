const markupGameBoard = {
  createSection() {
    return (
      `<main>
        <section class="game-board">
        </section>
     </main>`
    );
  },

  createGameBoard() {
    return (
      `<div class="game-board__wrapper" id="gameBoard">
     </div>`
    );
  },

  createStarContainer() {
    return (
      `<div class="game-board__star-container">
     </div>`
    );
  },

  createStar(el, type) {
    return (
      `<div class="game-board__star-container__star">
            <img src="assets/img/${el}.${type}" alt="${el}">
       </div>`
    );
  },

  createGameButton() {
    return (
      `<button class="game-board__button hidden" id="startGame">Start</button>
`
    );
  },
};

const markupMenu = {
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
                       <li class="main-header__menu-list__item"><div data-id="Main page"><a
                  class="main-header__menu-list__item__link main-header__menu-list__item__link--active"  id="mainPage">Main page</a></li>
              </ul>
            </nav>
          </div>
      </header>`
    );
  },

  createMenuItem(it) {
    return (
      `<li class="main-header__menu-list__item"><div data-id="${it}">
            <a class="main-header__menu-list__item__link"  id="${it}">${it}</a>
       </li>`
    );
  },

  createSwitcher() {
    return (
      `<div class="on-off-toggle">
        <input class="on-off-toggle__input" type="checkbox" id="bopis" />
        <label for="bopis" class="on-off-toggle__slider"></label>
      </div>`
    );
  },
};

const markupCard = {
  createCardCategory(cardItem) {
    return (
      `<div class="game-board__item-container">
         <div class="game-board__item" data-id="${cardItem}">
            <img src="./assets/img/${cardItem}.jpg" alt="${cardItem}">
            <span>${cardItem}</span>
         </div>
       </div>`
    );
  },

  createCard(cardItem) {
    return (
      `
       <div class="game-board__item-container">
           <div class="game-board__item game-board__item--front" sound-id="${cardItem.word}">
              <img class="game-board__item-img" src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
              <span class="game-board__item__text">${cardItem.word}</span>
              <div class="rotate" title="rotate">rotate</div>
           </div>
           <div class="game-board__item game-board__item--back">
              <img class="game-board__item-img" src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
              <span class="game-board__item__text">${cardItem.word}</span>
           </div>
       </div>`
    );
  },
};

export default { markupCard, markupGameBoard, markupMenu };
