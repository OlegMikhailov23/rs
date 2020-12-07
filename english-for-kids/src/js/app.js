import MenuComponents from './components/menu.component';
import GameBoard from './components/game-board.component';

import cards from './data/data';

const [nameCategories, actionSetA, actionSetB, actionSetC, animalSetA,
  animalSetB, clothes, emotion, adjective] = cards;

const shuffleArray = (arr) => {
  const modArr = arr.slice();
  for (let i = modArr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = modArr[i];
    modArr[i] = modArr[j];
    modArr[j] = t;
  }
  return modArr;
};

const createFinalScreen = (el, type, message) => {
  return (
    `<div class="final-screen">
         <img src="assets/img/${el}.${type}" alt="${el}">
         <span class="final-screen__message">${message}</span>
    </div>`
  );
};

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

class App {
  constructor() {
    this.dataForMenu = nameCategories;
    this.dataForGameBoard = nameCategories;
    this.menu = new MenuComponents(this.dataForMenu);
    this.gameBoard = new GameBoard(this.dataForGameBoard);

    this.startGame = this.startGame.bind(this);
    this.getUserWord = this.getUserWord.bind(this);
    this.repeatWord = this.repeatWord.bind(this);
    this.game = this.game.bind(this);

    this.isGame = false;
    this.location = null;

    this.sound = new Audio();
    this.errorSound = 'error';
    this.correctSound = 'correct';
    this.winSound = 'success';
    this.loseSound = 'failure';
    this.winMessage = 'Good job fellow!';
    this.winPicture = 'star';
    this.loseMessage = 'You should try better!';
    this.losePicture = 'poop';

    this.CARD_AMOUNT = 8;
    this.currentWordSet = [];
    this.wordFromPlayer = null;
    this.step = 0;
    this.errors = 0;
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
        this.endGame();
        switch (target) {
          case 'Action (set A)':
            this.gameBoard.init(actionSetA);
            this.makeCurrentWordSet(actionSetA);
            this.location = target;
            break;
          case 'Action (set B)':
            this.gameBoard.init(actionSetB);
            this.makeCurrentWordSet(actionSetB);
            this.location = target;
            break;
          case 'Action (set C)':
            this.gameBoard.init(actionSetC);
            this.makeCurrentWordSet(actionSetC);
            this.location = target;
            break;
          case 'Animal (set A)':
            this.gameBoard.init(animalSetA);
            this.makeCurrentWordSet(animalSetA);
            this.location = target;
            break;
          case 'Animal (set B)':
            this.gameBoard.init(animalSetB);
            this.makeCurrentWordSet(animalSetB);
            this.location = target;
            break;
          case 'Clothes':
            this.gameBoard.init(clothes);
            this.makeCurrentWordSet(clothes);
            this.location = target;
            break;
          case 'Emotions':
            this.gameBoard.init(emotion);
            this.makeCurrentWordSet(emotion);
            this.location = target;
            break;
          case 'Adjective':
            this.gameBoard.init(adjective);
            this.makeCurrentWordSet(adjective);
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
    document.querySelector('.game-board__button').classList.add('game-board__button--in-game');
    document.querySelector('.game-board__button').removeEventListener('click', this.startGame);
    this.speakApp(this.currentWordSet[this.step]);
    document.querySelector('.game-board__button').addEventListener('click', this.repeatWord);
    document.addEventListener('click', this.game);
  }

  game(e) {
    const starContainer = document.querySelector('.game-board__star-container');
    const mainContainer = document.querySelector('body');
    if (e.target.closest('.game-board__item--front')) {
      this.getUserWord(e);
    } else {
      return;
    }
    if (this.step >= this.CARD_AMOUNT - 1) {
      this.gameBoard.clearGameBoard();
      this.gameBoard.init(nameCategories);
      this.location = 'Main page';
      this.showStartButton(this.startButton);
      this.changeColor();
      if (this.errors !== 0) {
        this.speakApp(this.loseSound);
        render(mainContainer, createFinalScreen(this.losePicture, 'svg', this.loseMessage));
      } else {
        this.speakApp(this.winSound);
        render(mainContainer, createFinalScreen(this.winPicture, 'svg', this.winMessage));
      }
      this.endGame();
      setTimeout(() => {
        document.querySelector('.final-screen').remove();
      }, 5000);
    } else if (this.currentWordSet[this.step] === this.wordFromPlayer) {
      this.step += 1;
      this.disableIt(e.target.closest('.game-board__item--front'));
      this.speakApp(this.correctSound);
      setTimeout(() => {
        this.speakApp(this.currentWordSet[this.step]);
      }, 1000);
      this.gameBoard.render(starContainer, this.gameBoard.createStar(this.winPicture, 'svg'), 'afterbegin');
    } else {
      this.errors += 1;
      this.gameBoard.render(starContainer, this.gameBoard.createStar(this.losePicture, 'svg'), 'afterbegin');
      this.speakApp(this.errorSound);
    }
  }

  endGame() {
    document.querySelector('.game-board__button').removeEventListener('click', this.repeatWord);
    document.removeEventListener('click', this.game);
    this.startButton.classList.remove('game-board__button--in-game');
    this.startButton.addEventListener('click', this.startGame);
    this.gameBoard.clearStar();
    this.wordFromPlayer = null;
    this.step = 0;
    this.errors = 0;
  }

  repeatWord() {
    this.speakApp(this.currentWordSet[this.step]);
  }

  getUserWord(e) {
    this.wordFromPlayer = e.target.closest('.game-board__item--front').getAttribute('sound-id');
  }

  disableIt(el) {
    el.classList.add('disabled');
  }

  isSpeakable() {
    if (this.isGame) {
      this.gameBoard.stopSpeakCard();
    } else {
      document.addEventListener('click', this.gameBoard.startSpeakCard);
    }
  }

  makeCurrentWordSet(arr) {
    this.currentWordSet.length = 0;
    for (let i = 0; i < arr.length; i += 1) {
      this.currentWordSet.push(arr[i].word);
    }
    this.currentWordSet = shuffleArray(this.currentWordSet);
  }

  speakApp(src) {
    this.sound.src = `./assets/audio/${src}.mp3`;
    this.sound.autoplay = true;
  }

  initApp() {
    this.menu.init(nameCategories);
    this.gameBoard.init(nameCategories);
    this.chooseCategory();
    const switcher = document.querySelector('.on-off-toggle__input');
    this.setStartButton(document.querySelector('.game-board__button'));
    switcher.addEventListener('change', () => {
      this.isGame = !this.isGame;
      if (!this.isGame) {
        this.endGame();
      }
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
