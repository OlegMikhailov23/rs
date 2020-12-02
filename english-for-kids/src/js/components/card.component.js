export class Card {
  constructor() {
    this.container = null;
    this.focused = false;
  }

  setContainer() {
    this.container = document.querySelector('.game-board__wrapper');
  }

  createCardCategory(cardItem) {
    return (
      `<div class="game-board__item-container">
         <div class="game-board__item" data-id="${cardItem}">
            <img src="./assets/img/${cardItem}.jpg" alt="${cardItem}">
            <span>${cardItem}</span>
         </div>
       </div>`
    );
  }

  createCard(cardItem) {
    return (
      `
       <div class="game-board__item-container">
           <div class="game-board__item game-board__item--front">
              <img class="game-board__item-img" src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
              <span>${cardItem.word}</span>
              <div class="rotate">rotate</div>
           </div>
           <div class="game-board__item game-board__item--back">
              <img class="game-board__item-img" src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
              <span>${cardItem.translation}</span>
           </div>
       </div>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  flipCard(card) {
    card.classList.add('is-flipped');
  }

  flipCardBack(card) {
    if (card) {
      card.classList.remove('is-flipped');
    }
  }

  initCategory(it) {
    this.setContainer();
    this.render(this.container, this.createCardCategory(it), 'afterbegin');
  }

  initCard(it) {
    this.setContainer();
    this.render(this.container, this.createCard(it), 'afterbegin');
  }
}
