import { Card } from './card.component';

export class GameBoard {
  constructor(data) {
    this.listData = data;
  }

  createGameBoard() {
    return (
      `<main>
          <section class="game-board">
                <div class="game-board__wrapper" id="gameBoard">
          </section>
       </main>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  clearGameBoard() {
    const cardCollection = [...document.querySelectorAll('.game-board__item')];
    cardCollection.forEach((it) => {
      it.remove();
    });
  }

  createCategory(el, data) {
    data.map((it) => {
      el.initCategory(it);
    });
  }

  createCard(el, data) {
    data.map((it) => {
      el.initCard(it);
    });
  }

  init() {
    const container = document.querySelector('body');
    this.render(container, this.createGameBoard(), 'beforeend');
    const cardContainer = document.querySelector('.game-board__wrapper');
    const card = new Card(cardContainer);
    this.createCategory(card, this.listData);
  }
}
