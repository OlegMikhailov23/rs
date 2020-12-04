import Card from './card.component';

class GameBoard {
  constructor() {
    this.card = new Card();
  }

  createSection() {
    return (
      `<main>
          <section class="game-board">
          </section>
       </main>`
    );
  }

  createGameBoard() {
    return (
      `<div class="game-board__wrapper" id="gameBoard">
       </div>`
    );
  }

  createGameButton() {
    return (
      `<button class="game-board__button hidden" id="startGame">Start</button>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  clearGameBoard() {
    document.querySelector('.game-board__wrapper').remove();
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
      if (typeof data[0] !== 'string') {
        el.initCard(it, this.card.createCard(it));
      } else {
        el.initCard(it, this.card.createCardCategory(it));
      }
    });
    this.startFlipCard();
    this.startSpeak();
  }

  init(data) {
    const container = document.querySelector('body');
    if (!document.querySelector('main')) {
      this.render(container, this.createSection());
    }
    const cardContainer = document.querySelector('.game-board');
    this.render(cardContainer, this.createGameBoard(), 'afterbegin');
    if (!document.querySelector('.game-board__button')) {
      this.render(cardContainer, this.createGameButton());
    }
    this.createCard(this.card, data);
    const cardWrap = [...document.querySelectorAll('.game-board__item')];
    this.card.setCardWrap(cardWrap);
  }
}

export default GameBoard;
