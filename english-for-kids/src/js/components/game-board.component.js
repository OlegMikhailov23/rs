import Card from './card.component';

class GameBoard {
  constructor() {
    this.card = new Card();
    this.startSpeakCard = this.startSpeakCard.bind(this);
    this.startFlipCard = this.startFlipCard.bind(this);
    this.stopSpeakCard = this.stopSpeakCard.bind(this);
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

  createStarContainer() {
    return (
      `<div class="game-board__star-container">
       </div>`
    );
  }

  createStar(el, type) {
    return (
      `<div class="game-board__star-container__star">
            <img src="assets/img/${el}.${type}" alt="${el}">
       </div>`
    );
  }

  createGameButton() {
    return (
      `
            <button class="game-board__button hidden" id="startGame">Start</button>
      `
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  clearGameBoard() {
    document.querySelector('.game-board__wrapper').remove();
  }

  clearStar() {
    document.querySelectorAll('.game-board__star-container__star').forEach((it) => {
      it.remove();
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

  startSpeakCard(e) {
    if (e.target.closest('.game-board__item--front')) {
      const word = e.target.closest('.game-board__item--front').getAttribute('sound-id');
      this.card.speak(word);
    }
  }

  stopSpeakCard() {
    document.removeEventListener('click', this.startSpeakCard);
  }

  createCard(el, data) {
    data.forEach((it) => {
      if (typeof data[0] !== 'string') {
        el.initCard(it, this.card.createCard(it));
      } else {
        el.initCard(it, this.card.createCardCategory(it));
      }
    });
  }

  init(data) {
    const container = document.querySelector('body');
    if (!document.querySelector('main')) {
      this.render(container, this.createSection());
    }
    const cardContainer = document.querySelector('.game-board');
    this.render(cardContainer, this.createGameBoard(), 'afterbegin');
    const gameBoardWrapper = document.querySelector('.game-board__wrapper');
    if (!document.querySelector('.game-board__button')) {
      this.render(cardContainer, this.createGameButton());
    }
    this.createCard(this.card, data);
    this.render(gameBoardWrapper, this.createStarContainer(), 'afterbegin');
    const cardWrap = [...document.querySelectorAll('.game-board__item')];
    this.card.setCardWrap(cardWrap);
    this.card.setText([...document.querySelectorAll('.game-board__item__text')]);
    document.addEventListener('click', this.startSpeakCard);
    this.startFlipCard();
  }
}

export default GameBoard;
