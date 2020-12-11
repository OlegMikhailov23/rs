import Card from './card.component';
import markup from '../markup/markup';
import render from '../helper/helper.render';
import helperCard from '../helper/helper.card';

const createCard = (el, data) => {
  data.forEach((it) => {
    if (typeof data[0] !== 'string') {
      el.initCard(it, markup.markupCard.createCard(it));
    } else {
      el.initCard(it, markup.markupCard.createCardCategory(it));
    }
  });
};

class GameBoard {
  constructor() {
    this.card = new Card();
    this.startSpeakCard = this.startSpeakCard.bind(this);
    this.stopSpeakCard = this.stopSpeakCard.bind(this);
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

  init(data) {
    const container = document.querySelector('body');
    if (!document.querySelector('main')) {
      render(container, markup.markupGameBoard.createSection());
    }
    const cardContainer = document.querySelector('.game-board');
    render(cardContainer, markup.markupGameBoard.createGameBoard(), 'afterbegin');
    const gameBoardWrapper = document.querySelector('.game-board__wrapper');
    if (!document.querySelector('.game-board__button')) {
      render(cardContainer, markup.markupGameBoard.createGameButton());
    }
    createCard(this.card, data);
    render(gameBoardWrapper, markup.markupGameBoard.createStarContainer(), 'afterbegin');
    const cardWrap = [...document.querySelectorAll('.game-board__item')];
    this.card.setCardWrap(cardWrap);
    this.card.setText([...document.querySelectorAll('.game-board__item__text')]);
    document.addEventListener('click', this.startSpeakCard);
    helperCard.startFlipCard();
  }
}

export default GameBoard;
