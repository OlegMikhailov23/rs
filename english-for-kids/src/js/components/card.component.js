export class Card {
  constructor(container) {
    this.container = container;
  }

  createCardCategory(cardItem) {
    return (
      `<div class="game-board__item" data-id="${cardItem}">
          <img src="./assets/img/${cardItem}.jpg" alt="${cardItem}">
          <span>${cardItem}</span>
       </div>`
    );
  }

  createCard(cardItem) {
    return (
      `<div class="game-board__item">
          <img src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
          <span>${cardItem.word}</span>
       </div>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  initCategory(it) {
    this.render(this.container, this.createCardCategory(it), 'afterbegin');
  }

  initCard(it) {
    this.render(this.container, this.createCard(it), 'afterbegin');
  }
}
