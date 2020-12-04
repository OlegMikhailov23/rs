import MenuComponents from './components/menu.component';
import GameBoard from './components/game-board.component';

import { cards } from './data/data';

const [nameCategories, actionSetA, actionSetB, actionSetC, animalSetA,
  animalSetB, clothes, emotion, adjective] = cards;

class App {
  constructor() {
    this.dataForMenu = nameCategories;
    this.dataForGameBoard = nameCategories;
    this.menu = new MenuComponents(this.dataForMenu);
    this.gameBoard = new GameBoard(this.dataForGameBoard);
    this.isGame = false;
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
            break;
          case 'Action (set B)':
            this.gameBoard.init(actionSetB);
            break;
          case 'Action (set C)':
            this.gameBoard.init(actionSetC);
            break;
          case 'Animal (set A)':
            this.gameBoard.init(animalSetA);
            break;
          case 'Animal (set B)':
            this.gameBoard.init(animalSetB);
            break;
          case 'Clothes':
            this.gameBoard.init(clothes);
            break;
          case 'Emotions':
            this.gameBoard.init(emotion);
            break;
          case 'Adjective':
            this.gameBoard.init(adjective);
            break;
          case 'Main page':
            this.gameBoard.init(nameCategories);
            break;
          default:
            break;
        }
        this.changeColor();
      }
    });
  }

  showStartButton(el) {
    if (this.isGame) {
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

  initApp() {
    this.menu.init(nameCategories);
    this.gameBoard.init(nameCategories);
    this.chooseCategory();
    const switcher = document.querySelector('.on-off-toggle__input');
    const startButton = document.querySelector('.game-board__button');
    switcher.addEventListener('change', () => {
      this.isGame = !this.isGame;
      this.changeColor();
      this.showStartButton(startButton);
    });
  }
}

export default App;
