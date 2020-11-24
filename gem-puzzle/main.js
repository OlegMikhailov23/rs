(() => {
  const Gameboard = {
    elements: {
      diceContainer: null,
      gameBoardOverlay: null,
      dices: [],
    },

    layout: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '',
    ],

    properties: {
      isGameBegin: false,
      isGameFromSave: false,
      fieldSize: 16,
      emptyPosition: null,
      verticalNeighborAbove: null,
      verticalNeighborUnder: null,
      currentSequence: [],
      minutes: 0,
      seconds: 0,
      moves: 0,
      isPaused: false,
      timerId: null,
      savedSequence: null,
      isMusicOn: false,
      isSoundOn: false,
      mainThemeMusic: '',
      effectSound: '',
      SOUND_TRACKS_AMOUNT: 4,
      AMOUNT_OF_BEST_PLAYERS: 10,
      GAME_PICTURE: 4,
      currentGamePicture: null,
    },

    getPosition(el, containEl) {
      return [...document.querySelectorAll(el)].findIndex((n) => n.classList.contains(containEl));
    },

    shuffleArray(arr) {
      const modArr = arr.slice();
      for (let i = modArr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = modArr[i];
        modArr[i] = modArr[j];
        modArr[j] = t;
      }
      return modArr;
    },

    getRandomNumber(min, max) {
      const rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    },

    init() {
      this.elements.diceContainer = document.createElement('div'); // Create container for dices

      this.elements.gameBoardOverlay = document.createElement('div'); // Create overlay

      this.elements.diceContainer.classList.add('game-board');

      this.elements.gameBoardOverlay.classList.add('overlay');
      if (this.properties.isGameFromSave) {
        this.elements.diceContainer.appendChild(this.createDices(this.properties.savedSequence));
      } else {
        this.elements.diceContainer.appendChild(this.createDices(this.layout));
      }

      this.elements.dices = this.elements.diceContainer.querySelectorAll('.dice');

      this.renderTemplate(document.querySelector('body'), this.createControls()); // Create control's board

      document.body.appendChild(this.elements.diceContainer);

      this.elements.diceContainer.appendChild(this.elements.gameBoardOverlay);

      this.renderTemplate(document.querySelector('.overlay'), this.createOverlayMenu()); // Create overlay menu

      const pauseGameButton = document.querySelector('#pauseButton');

      const resumeButton = document.querySelector('#resumeGame');

      const musicButton = document.querySelector('#musicButton');

      const soundButton = document.querySelector('#soundButton');

      const newGameButton = document.querySelector('#newGame');

      const loadGameButton = document.querySelector('#loadGame');

      const emptyDice = document.querySelector('.empty');

      const saveGameButton = document.querySelector('#saveGame');

      const resultButton = document.querySelector('#bestResult');

      const hintButton = document.querySelector('#hintButton');

      this.properties.emptyPosition = [...document.querySelectorAll('.dice')].findIndex((n) => n.classList.contains('empty'));
      this.properties.verticalNeighborAbove = emptyDice.parentNode
        .childNodes[this.properties.emptyPosition - 4];
      this.properties.verticalNeighborUnder = emptyDice.parentNode
        .childNodes[this.properties.emptyPosition + 4];

      this.properties.timerId = setInterval(this.startTimer, 1000);

      this.pauseGame();

      if (this.properties.isGameBegin) {
        musicButton.addEventListener('click', this.switchMusic);
        soundButton.addEventListener('click', this.switchSound);
        pauseGameButton.addEventListener('click', this.pauseGame);
        resumeButton.addEventListener('click', this.pauseGame);
      }
      newGameButton.addEventListener('click', this.beginNewGame);
      loadGameButton.addEventListener('click', this.openLoadGame);
      saveGameButton.addEventListener('click', this.saveGame);
      resultButton.addEventListener('click', this.showResult);
      hintButton.addEventListener('click', this.showHint);
    },

    createDices(layout) {
      const fragment = document.createDocumentFragment();
      let gameLayout = layout.slice();
      if (this.properties.isGameFromSave === false) {
        gameLayout = this.shuffleArray(gameLayout);
        this.properties.currentGamePicture = this.getRandomNumber(1, this.properties.GAME_PICTURE);
      }
      gameLayout.forEach((dice, ind) => {
        const diceElement = document.createElement('div');
        // Add classes
        diceElement.classList.add('dice');
        diceElement.textContent = `${gameLayout[ind]}`;
        if (diceElement.textContent !== '') {
          diceElement.style.backgroundImage = `url('assets/dice-bg/${this.properties.currentGamePicture}/${diceElement.textContent - 1}.jpg')`;
        } else {
          diceElement.style.backgroundImage = `url('assets/dice-bg/${this.properties.currentGamePicture}/${this.layout.length - 1}.jpg')`;
        }
        const getContent = diceElement.textContent;
        const diceElementCondition = {
          pressed: null,
        };

        const moveListener = (e) => {
          if (diceElementCondition.pressed) { // if we are grabbing dice
            this.dragAndDrop(e, diceElement);
            diceElement.removeEventListener('mousemove', moveListener);
          }
        };

        const downListener = () => {
          diceElementCondition.pressed = true;
          diceElement.addEventListener('mousemove', moveListener);
        };

        diceElement.addEventListener('mousedown', downListener);

        const upListener = (e) => {
          this.move(e.target);
        };
        switch (getContent) {
          case '': // if empty
            diceElement.textContent = '';
            diceElement.classList.add('empty');

            break;
          default: // if dice with number
            diceElement.textContent = gameLayout[ind];
            diceElement.addEventListener('mouseup', (e) => {
              upListener(e);
              diceElementCondition.pressed = false;
            });

            break;
        }

        fragment.appendChild(diceElement);
      });

      return fragment;
    },

    move(el) {
      function findPrevious(obj) {
        do {
          obj = obj.previousSibling;
        } while (obj && obj.nodeType !== 1);
        return obj;
      }
      const findNext = (obj) => {
        do {
          obj = obj.nextElementSibling;
        } while (obj && obj.nodeType !== 1);
        return obj;
      };
      if (el.previousElementSibling && el.previousElementSibling.textContent === '') {
        if (el.offsetTop !== el.previousElementSibling.offsetTop) {
          return;
        }

        this.countMove();
        this.playSoundEffect('assets/sound/swap.mp3');
        this.properties.emptyPosition = this.getPosition('.dice', 'empty');
        this.properties.emptyPosition += 2;
        this.properties.verticalNeighborUnder = el.parentNode
          .childNodes[this.properties.emptyPosition + 3];
        this.properties.verticalNeighborAbove = el.parentNode
          .childNodes[this.properties.emptyPosition - 5];
        const previous = findPrevious(el);
        if (previous) {
          el.parentNode.insertBefore(el, previous);
        }
      } else if (el.nextElementSibling && el.nextElementSibling.textContent === '') {
        if (el.offsetTop !== el.nextElementSibling.offsetTop) {
          // Check that empty and clicked dices on one line
          return;
        }
        this.countMove();
        this.playSoundEffect('assets/sound/swap.mp3');
        this.properties.emptyPosition = this.getPosition('.dice', 'empty');
        this.properties.verticalNeighborUnder = el.parentNode
          .childNodes[this.properties.emptyPosition + 3];
        this.properties.verticalNeighborAbove = el.parentNode
          .childNodes[this.properties.emptyPosition - 5];
        const next = findNext(el);
        if (next) {
          el.parentNode.insertBefore(el.nextElementSibling, el);
        }
      } else if (el === this.properties.verticalNeighborAbove) {
        this.countMove();
        this.playSoundEffect('assets/sound/swap.mp3');
        this.properties.emptyPosition = this.getPosition('.dice', 'empty');
        this.swapElements(el, document.querySelector('.empty'));
        this.properties.verticalNeighborUnder = this.properties.verticalNeighborAbove;
        this.properties.verticalNeighborAbove = el.parentNode
          .childNodes[this.properties.emptyPosition - 8];
      } else if (el === this.properties.verticalNeighborUnder) {
        this.countMove();
        this.playSoundEffect('assets/sound/swap.mp3');
        this.properties.emptyPosition = this.getPosition('.dice', 'empty');
        this.swapElements(el, document.querySelector('.empty'));
        this.properties.verticalNeighborAbove = this.properties.verticalNeighborUnder;
        this.properties.verticalNeighborUnder = document.querySelector('.empty').parentNode.childNodes[this.properties.emptyPosition + 8];
      }

      this.checkForWin();
    },

    swapElements(obj1, obj2) {
      const temp = document.createElement('div');
      obj1.parentNode.insertBefore(temp, obj1);
      // move obj1 to right before obj2
      obj2.parentNode.insertBefore(obj1, obj2);
      // move obj2 to right before where obj1 used to be
      temp.parentNode.insertBefore(obj2, temp);
      // remove temporary marker node
      temp.parentNode.removeChild(temp);
    },

    checkForWin() {
      document.querySelectorAll('.dice').forEach((it) => this.properties.currentSequence.push(it.textContent));
      // Fix clone problem after drag-n-drop action
      if (this.properties.currentSequence.length > this.layout.length) {
        this.properties.currentSequence.pop();
      }
      // Let's save it
      this.properties.savedSequence = JSON.stringify(this.properties.currentSequence);
      if (this.properties.currentSequence.join(' ') === this.layout.join(' ')) {
        document.querySelector('.empty').classList.remove('empty');
        this.pauseGame();
        const winContainer = document.createElement('div');
        winContainer.classList.add('win-container');
        document.querySelector('.overlay').appendChild(winContainer);

        const winMessage = document.createElement('span');
        winContainer.classList.add('win-message');
        winMessage.innerHTML = `Congratulation, you have resolved puzzle in ${this.properties.moves} turns! <br> Your time is: ${this.properties.minutes} : ${this.properties.seconds}.`;
        winContainer.appendChild(winMessage);

        const winName = document.createElement('input');
        winName.classList.add('winner-name');
        winName.setAttribute('placeholder', 'Inter your name');
        winName.setAttribute('required', 'required');
        winContainer.appendChild(winName);

        const winConfirm = document.createElement('button');
        winConfirm.classList.add('menu-button--sub');
        winConfirm.innerHTML = 'Confirm';
        winContainer.appendChild(winConfirm);

        document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));

        winConfirm.addEventListener('click', () => {
          if (winName.value) {
            this.savePlayerResult(winName.value, `${this.properties.minutes} : ${this.properties.seconds}`, this.properties.moves, `${(this.properties.minutes * 60) + this.properties.seconds}`);
            winContainer.remove();
            document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));
            this.beginNewGame();
            this.pauseGame();
          } else {
            alert('Please, inter your name...');
          }
        });
      }

      this.properties.currentSequence.length = 0;
    },

    // Generate templates
    renderTemplate(container, template, place = 'beforeend') {
      container.insertAdjacentHTML(place, template);
    },

    createControls() {
      return (
        `    <div class="game-controls">
        <div class="time"><span id="minutes">${this.properties.minutes}</span>:<span id="seconds">${this.properties.seconds}</span></div>
        <div class="game-controls__move">
           <span>Moves: </span><span id="moveCount">${this.properties.moves}</span>
        </div>
        <button id="musicButton"><span class="material-icons">music_note</span></button>
        <button id="soundButton" title="Effects"><span class="material-icons">volume_mute</span></button>
        <button id="pauseButton"><span class="material-icons">pause_circle_filled</span></button>
        <button id="hintButton"><span class="material-icons">remove_red_eye</span></button>
    </div>`
      );
    },

    createOverlayMenu() {
      return (
        `<button class="menu-button menu-button--main" id="newGame">New Game</button>
                 <button class="menu-button menu-button--main" id="saveGame">Save Game</button>
                 <button class="menu-button menu-button--main" id="loadGame">Load Game</button>
                 <button class="menu-button menu-button--main" id="bestResult">Best Result</button>
                 <button class="menu-button menu-button--main" id="resumeGame">Resume</button>`
      );
    },

    createLoadMenu(numb) {
      return (
        `<button class="menu-button menu-button--sub" data-id="${numb}">Game: ${numb}</button>`
      );
    },

    // Game function

    startTimer() {
      const addZero = (numb) => (parseInt(numb, 10) < 10 ? '0' : '') + numb;
      if (!Gameboard.properties.isPaused) {
        const second = document.querySelector('#seconds');
        const minute = document.querySelector('#minutes');
        if (Number(Gameboard.properties.seconds) === 59) {
          Gameboard.properties.minutes = Number(Gameboard.properties.minutes) + 1;
          minute.innerHTML = Gameboard.properties.minutes;
          minute.innerHTML = addZero(minute.innerHTML);
          Gameboard.properties.seconds = 0;
          second.innerHTML = Gameboard.properties.second;
        }
        Gameboard.properties.seconds = Number(Gameboard.properties.seconds) + 1;
        second.innerHTML = Gameboard.properties.seconds;
        second.innerHTML = addZero(second.innerHTML);
      }
    },

    countMove() {
      const moveCount = document.querySelector('#moveCount');
      Gameboard.properties.moves = Number(Gameboard.properties.moves) + 1;
      moveCount.innerHTML = Gameboard.properties.moves;
    },

    pauseGame() {
      Gameboard.properties.isPaused = !Gameboard.properties.isPaused;
      Gameboard.elements.gameBoardOverlay.classList.toggle('overlay--show');
    },

    switchMusic() {
      Gameboard.properties.mainThemeMusic.autoplay = true;
      Gameboard.properties.isMusicOn = !Gameboard.properties.isMusicOn;
      if (Gameboard.properties.isMusicOn) {
        Gameboard.properties.mainThemeMusic.play();
      } else {
        Gameboard.properties.mainThemeMusic.pause();
      }
    },

    switchSound() {
      Gameboard.properties.isSoundOn = !Gameboard.properties.isSoundOn;
    },

    beginNewGame() {
      Gameboard.properties.isGameFromSave = false;
      Gameboard.properties.isGameBegin = true;
      Gameboard.playSoundEffect('assets/sound/new-game.mp3');
      Gameboard.elements.diceContainer.remove();
      Gameboard.elements.diceContainer = null;
      Gameboard.elements.gameBoardOverlay.remove();
      Gameboard.elements.gameBoardOverlay = null;
      document.querySelector('.game-controls').remove();
      Gameboard.properties.minutes = '00';
      Gameboard.properties.seconds = '00';
      Gameboard.properties.moves = '0';
      Gameboard.properties.currentGamePicture = null;
      clearInterval(Gameboard.properties.timerId);
      if (!Gameboard.properties.mainThemeMusic) {
        Gameboard.playMusic(`assets/sound/${Gameboard.getRandomNumber(1, Gameboard.properties.SOUND_TRACKS_AMOUNT)}.mp3`);
      }
      Gameboard.init();
      Gameboard.properties.isPaused = false;
      Gameboard.elements.gameBoardOverlay.classList.remove('overlay--show');
    },

    showResult() {
      Gameboard.playSoundEffect('assets/sound/click.mp3');
      const bestPlayersList = JSON.parse(localStorage.getItem('result'));
      const bestResultContainer = document.createElement('div');
      bestResultContainer.classList.add('result-container');
      document.querySelector('.overlay').appendChild(bestResultContainer);
      document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));
      if (!bestPlayersList) {
        const bestPlayer = document.createElement('div');
        bestPlayer.classList.add('best-player');
        bestPlayer.innerHTML = 'THERE IS NO BEST PLAYERS YET :(';
        bestResultContainer.appendChild(bestPlayer);
      } else {
        bestPlayersList.sort((a, b) => (Number(a.timeValue) > Number(b.timeValue) ? 1 : -1));
        let amountOfBestPlayers;
        if (bestPlayersList.length > Gameboard.properties.AMOUNT_OF_BEST_PLAYERS) {
          amountOfBestPlayers = Gameboard.properties.AMOUNT_OF_BEST_PLAYERS;
        } else {
          amountOfBestPlayers = bestPlayersList.length;
        }
        for (let j = 0; j < amountOfBestPlayers; j += 1) {
          const bestPlayer = document.createElement('div');
          bestPlayer.classList.add('best-player');
          bestPlayer.innerHTML = `${bestPlayersList[j].name} : ${bestPlayersList[j].time}`;
          bestResultContainer.appendChild(bestPlayer);
        }
      }

      const backButton = document.createElement('button');
      backButton.classList.add('back-button');
      backButton.innerHTML = 'Go Back';
      bestResultContainer.appendChild(backButton);

      backButton.addEventListener('click', () => {
        Gameboard.playSoundEffect('assets/sound/click.mp3');
        bestResultContainer.remove();
        document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));
      });
    },

    showHint() {
      document.querySelectorAll('.dice').forEach((it) => {
        it.classList.toggle('dice--hint');
      });
    },

    openLoadGame() {
      Gameboard.playSoundEffect('assets/sound/click.mp3');
      const saveGamesList = JSON.parse(localStorage.getItem('saveGames'));
      const loadMenuContainer = document.createElement('div');
      loadMenuContainer.classList.add('load-menu-container');
      document.querySelector('.overlay').appendChild(loadMenuContainer);
      document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));
      if (saveGamesList) {
        for (let i = 1; i <= saveGamesList.length; i += 1) {
          Gameboard.renderTemplate(loadMenuContainer, Gameboard.createLoadMenu(i));
        }
      }
      const deleteSaveGame = document.createElement('button');
      deleteSaveGame.classList.add('delete-button');
      deleteSaveGame.innerHTML = 'Delete Games';

      const backButton = document.createElement('button');
      backButton.classList.add('back-button');
      backButton.innerHTML = 'Go Back';

      loadMenuContainer.appendChild(deleteSaveGame);
      loadMenuContainer.appendChild(backButton);

      deleteSaveGame.addEventListener('click', () => {
        Gameboard.playSoundEffect('assets/sound/delete.mp3');
        localStorage.removeItem('saveGames');
        loadMenuContainer.remove();
        document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));
        alert('All saves has been deleted. Have a nice day:)');
      });

      backButton.addEventListener('click', () => {
        Gameboard.playSoundEffect('assets/sound/click.mp3');
        loadMenuContainer.remove();
        document.querySelectorAll('.menu-button--main').forEach((button) => button.classList.toggle('hide'));
      });

      document.querySelectorAll('.menu-button--sub').forEach((game) => {
        game.addEventListener('click', (e) => {
          const saveId = e.target.getAttribute('data-id');
          Gameboard.beginLoadGame(saveGamesList, saveId);
        });
      });
    },

    beginLoadGame(data, id) {
      Gameboard.properties.isGameBegin = true;
      Gameboard.properties.isGameFromSave = true;
      Gameboard.playSoundEffect('assets/sound/new-game.mp3');
      Gameboard.elements.diceContainer.remove();
      Gameboard.elements.diceContainer = null;
      Gameboard.elements.gameBoardOverlay.remove();
      Gameboard.elements.gameBoardOverlay = null;
      document.querySelector('.game-controls').remove();

      Gameboard.properties.minutes = data[id - 1].minutes;
      Gameboard.properties.seconds = data[id - 1].seconds;
      Gameboard.properties.moves = data[id - 1].moves;
      Gameboard.properties.currentGamePicture = data[id - 1].currentGamePicture;
      Gameboard.properties.savedSequence = JSON.parse(data[id - 1].savedSequence);
      clearInterval(Gameboard.properties.timerId);

      Gameboard.init();
      Gameboard.properties.isPaused = false;

      Gameboard.elements.gameBoardOverlay.classList.remove('overlay--show');
    },

    savePlayerResult(name, time, moves, timeValue) {
      let existingResult = JSON.parse(localStorage.getItem('result'));
      if (existingResult === null) existingResult = [];
      const player = {
        name,
        time,
        moves,
        timeValue,
      };
      existingResult.push(player);
      localStorage.setItem('result', JSON.stringify(existingResult));
    },

    saveGame() {
      if (!Gameboard.properties.isGameBegin) {
        return;
      }
      Gameboard.playSoundEffect('assets/sound/click.mp3');
      let existingSaveGames = JSON.parse(localStorage.getItem('saveGames'));
      if (existingSaveGames === null) existingSaveGames = [];
      if (existingSaveGames.length === 5) {
        alert('To much save Games. Please, delete your previous games :)');
        return;
      }
      // Save all Saves back to local storage
      existingSaveGames.push(Gameboard.properties);
      localStorage.setItem('saveGames', JSON.stringify(existingSaveGames));
    },

    playMusic(src) {
      this.properties.mainThemeMusic = new Audio();
      this.properties.mainThemeMusic.src = src;
      this.properties.mainThemeMusic.addEventListener('ended', () => {
        this.properties.mainThemeMusic.src = `assets/sound/${this.getRandomNumber(1, this.properties.SOUND_TRACKS_AMOUNT)}.mp3`;
        this.properties.mainThemeMusic.play();
      });
      if (this.properties.isMusicOn) {
        this.properties.mainThemeMusic.autoplay = true;
      }
    },

    playSoundEffect(src) {
      if (!this.properties.effectSound) this.properties.effectSound = new Audio();
      this.properties.effectSound.src = src;
      if (this.properties.isSoundOn) this.properties.effectSound.play();
    },

    dragAndDrop(e, draggableEl) {
      const createCopy = draggableEl.cloneNode(true);
      document.body.append(createCopy);
      draggableEl.classList.add('hidden');
      const startCoordinate = {
        x: e.clientX,
        y: e.clientY,
      };
      const shiftX = e.clientX - draggableEl.getBoundingClientRect().left;
      const shiftY = e.clientY - draggableEl.getBoundingClientRect().top;

      createCopy.style.position = 'absolute';
      createCopy.style.width = '101px';
      createCopy.style.height = '101px';

      function moveAt(pageX, pageY) {
        createCopy.style.left = `${pageX - shiftX}px`;
        createCopy.style.top = `${pageY - shiftY}px`;
      }

      moveAt(e.pageX, e.pageY);

      let droppableBelow = null;

      function onMouseMove(evt) {
        moveAt(evt.pageX, evt.pageY);
        createCopy.style.zIndex = '-1';
        const elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);
        createCopy.style.zIndex = '1';

        droppableBelow = elementBelow.closest('.empty');
      }

      document.addEventListener('mousemove', onMouseMove);

      createCopy.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        if (droppableBelow) {
          Gameboard.move(e.target);
        } else {
          moveAt(startCoordinate.x, startCoordinate.y);
        }
        createCopy.remove();
        draggableEl.classList.remove('hidden');
        createCopy.onmouseup = null;
      };

      createCopy.ondragstart = function () {
        return false;
      };
      createCopy.ondragstart();
    },
  };

  window.addEventListener('DOMContentLoaded', () => {
    Gameboard.init();
  });
})();
