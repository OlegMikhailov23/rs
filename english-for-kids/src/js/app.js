import MenuComponents from './components/menu.component';
import GameBoard from './components/game-board.component';

import cards from './data/data';

const [nameCategories, actionSetA, actionSetB, actionSetC, animalSetA,
  animalSetB, clothes, emotion, adjective] = cards;

class App {
  constructor() {
    this.dataForMenu = nameCategories;
    this.dataForGameBoard = nameCategories;
    this.menu = new MenuComponents(this.dataForMenu);
    this.gameBoard = new GameBoard(this.dataForGameBoard);
    this.isGame = false;
    this.isGameStart = false;
    this.location = null;
  }

  setStartButton(el) {
    this.startButton = el;
  }

  chooseCategory() {
    document.addEventListener('click', (e) => {
      let target;
      if (e.target.closest('div')) {
        target = e.target.closest('div').getAttribute('data-id');
      }
      if (target) {
        this.gameBoard.clearGameBoard();
        switch (target) {
          case 'Action (set A)':
            this.gameBoard.init(actionSetA);
            this.location = target;
            break;
          case 'Action (set B)':
            this.gameBoard.init(actionSetB);
            this.location = target;
            break;
          case 'Action (set C)':
            this.gameBoard.init(actionSetC);
            this.location = target;
            break;
          case 'Animal (set A)':
            this.gameBoard.init(animalSetA);
            this.location = target;
            break;
          case 'Animal (set B)':
            this.gameBoard.init(animalSetB);
            this.location = target;
            break;
          case 'Clothes':
            this.gameBoard.init(clothes);
            this.location = target;
            break;
          case 'Emotions':
            this.gameBoard.init(emotion);
            this.location = target;
            break;
          case 'Adjective':
            this.gameBoard.init(adjective);
            this.location = target;
            break;
          case 'Main page':
            this.gameBoard.init(nameCategories);
            this.location = target;
            break;
          default:
            break;
        }
        this.gameBoard.card.text.forEach((it) => {
          this.hideText(it);
        });
        this.isSpeakable();
        this.showStartButton(this.startButton);
        this.changeColor();
      }
    });
  }

  showStartButton(el) {
    if (this.isGame && this.location !== 'Main page' && this.location !== null) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  changeColor() {
    if (this.isGame) {
      this.menu.container.classList.add('collapse--game');
      this.gameBoard.card.cardContainer.forEach((it) => {
        it.classList.add('game-board__item--game');
      });
    } else {
      this.menu.container.classList.remove('collapse--game');
      this.gameBoard.card.cardContainer.forEach((it) => {
        it.classList.remove('game-board__item--game');
      });
    }
  }

  hideText(el) {
    if (this.isGame) {
      el.style.fontSize = '0';
    } else {
      el.style.fontSize = '1.5rem';
    }
  }

  startGame() {
    this.isGameStart = true;
    document.querySelector('.game-board__button').classList.add('game-board__button--in-game');
    document.querySelector('.game-board__button').removeEventListener('click', this.startGame);
  }

  isSpeakable() {
    if (this.isGame) {
      this.gameBoard.stopSpeakCard();
    } else {
      document.addEventListener('click', this.gameBoard.startSpeakCard);
    }
  }

  initApp() {
    this.menu.init(nameCategories);
    this.gameBoard.init(nameCategories);
    this.chooseCategory();
    const switcher = document.querySelector('.on-off-toggle__input');
    this.setStartButton(document.querySelector('.game-board__button'));
    switcher.addEventListener('change', () => {
      this.isGame = !this.isGame;
      this.startButton.classList.remove('game-board__button--in-game');
      this.isSpeakable();
      this.changeColor();
      this.showStartButton(this.startButton);
      this.gameBoard.card.text.forEach((it) => {
        this.hideText(it);
      });
    });
    this.startButton.addEventListener('click', this.startGame);
  }
}

export default App;
