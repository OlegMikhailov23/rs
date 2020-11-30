import { MenuComponents } from './components/menu.component';
import { GameBoard } from './components/game-board.component';
import { cards } from './data/data';

export class App {
  constructor(name) {
    this.name = name;
    this.menu = new MenuComponents(cards[0]);
    this.gameBoard = new GameBoard(cards[0]);
  }

  initApp() {
    this.menu.init();
    this.gameBoard.init();
  }
}
