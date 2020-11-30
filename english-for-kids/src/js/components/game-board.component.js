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

  createCard(cardItem) {
    return (
      `<div class="game-board__item"><img src="./assets/img/${cardItem}.jpg" alt="${cardItem}"><span>${cardItem}</span></div>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  init() {
    const container = document.querySelector('body');
    this.render(container, this.createGameBoard(), 'beforeend');
    const cardList = document.querySelector('.game-board__wrapper');
    this.listData.map((it) => {
      this.render(cardList, this.createCard(it), 'afterbegin');
    });
  }
}
