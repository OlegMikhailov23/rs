import { Card } from './card.component';

export class GameBoard {
  constructor(data) {
    this.listData = data;
    this.card = new Card();
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
    const cardCollection = [...document.querySelectorAll('.game-board__item-container')];
    cardCollection.forEach((it) => {
      it.remove();
    });
  }

  createCategory(el, data) {
    data.map((it) => {
      el.initCategory(it);
    });
  }

  startFlipCard() {
    document.querySelectorAll('.rotate').forEach((it) => {
      it.addEventListener('click', (e) => {
        this.card.flipCard(e.target.closest('.game-board__item-container'));
        this.startFlipCardBack();
      });
    });
  }

  startFlipCardBack() {
    document.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('game-board__wrapper') && e.relatedTarget) {
        this.card.flipCardBack(e.relatedTarget.closest('.is-flipped'));
      }
    });
  }

  startSpeak() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.game-board__item--front')) {
        const word = e.target.closest('.game-board__item--front').getAttribute('sound-id');
        this.card.speak(word);
      }
    });
  }

  createCard(el, data) {
    data.map((it) => {
      el.initCard(it);
    });
    this.startFlipCard();
    this.startSpeak();
  }

  init() {
    const container = document.querySelector('body');
    this.render(container, this.createGameBoard(), 'beforeend');
    this.createCategory(this.card, this.listData);
  }
}
