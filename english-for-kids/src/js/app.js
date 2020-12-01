import { MenuComponents } from './components/menu.component';
import { GameBoard } from './components/game-board.component';
import { Card } from './components/card.component';

import { cards } from './data/data';

const [nameCategories, actionSetA, actionSetB, actionSetC, animalSetA,
  animalSetB, clothes, emotion, adjective] = cards;

export class App {
  constructor(name) {
    this.name = name;
    this.gameMode = 'train';
    this.dataForMenu = nameCategories;
    this.dataForgameBoard = nameCategories;
    this.menu = new MenuComponents(this.dataForMenu);
    this.gameBoard = new GameBoard(this.dataForgameBoard);
  }

  choseCategory() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('div').getAttribute('data-id');
      if (target) {
        this.gameBoard.clearGameBoard();
        const card = new Card(document.querySelector('.game-board__wrapper'));
        switch (target) {
          case 'Action (set A)':
            this.gameBoard.createCard(card, actionSetA);
            break;
          case 'Action (set B)':
            this.gameBoard.createCard(card, actionSetB);
            break;
          case 'Action (set C)':
            this.gameBoard.createCard(card, actionSetC);
            break;
          case 'Animal (set A)':
            this.gameBoard.createCard(card, animalSetA);
            break;
          case 'Animal (set B)':
            this.gameBoard.createCard(card, animalSetB);
            break;
          case 'Clothes':
            this.gameBoard.createCard(card, clothes);
            break;
          case 'Emotions':
            this.gameBoard.createCard(card, emotion);
            break;
          case 'Adjective':
            this.gameBoard.createCard(card, adjective);
            break;
          default:
            break;
        }
      }
    });
  }

  initApp() {
    this.menu.init();
    this.gameBoard.init();
    this.choseCategory();
  }
}
