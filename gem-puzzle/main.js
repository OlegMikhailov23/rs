'use strict';

const Gameboard = {
    elements: {
        diceContainer: null,
        gameBoardOverlay: null,
        dices: []
    },

    layout: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", ""
    ],

    properties: {
        fieldSize: 16,
        emptyPosition: null,
        verticalNeighborAbove: null,
        verticalNeighborUnder: null,
        currentSequence: [],
        minutes: '00',
        seconds: '00',
        moves: '0',
        isPaused: false,
        timerId: null,
    },

    getPosition(el, containEl) {
        return [...document.querySelectorAll(el)].findIndex(n => n.classList.contains(containEl))
    },

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        return arr;
    },

    init() {
        this.elements.diceContainer = document.createElement("div"); // Create container for dices

        this.elements.gameBoardOverlay = document.createElement("div"); // Create overlay

        this.elements.diceContainer.classList.add("game-board");

        this.elements.gameBoardOverlay.classList.add("overlay");

        this.elements.diceContainer.appendChild(this.createDices(this.layout));

        this.elements.dices = this.elements.diceContainer.querySelectorAll('.dice');

        this.renderTemplate(document.querySelector('body'), this.createControls()); // Create control's board

        document.body.appendChild(this.elements.diceContainer);

        this.elements.diceContainer.appendChild(this.elements.gameBoardOverlay);

        this.renderTemplate(document.querySelector('.overlay'), this.createOverlayMenu()); // Create overlay menu

        const pauseGameButton = document.querySelector('#pauseButton');

        const newGameButton = document.querySelector('#newGame')

        const emptyDice = document.querySelector('.empty');

        this.properties.emptyPosition = [...document.querySelectorAll('.dice')].findIndex(n => n.classList.contains('empty'));
        this.properties.verticalNeighborAbove = emptyDice.parentNode.childNodes[this.properties.emptyPosition - 4];
        this.properties.verticalNeighborUnder = emptyDice.parentNode.childNodes[this.properties.emptyPosition + 4];

        this.properties.timerId = setInterval(this.startTimer, 1000);

        this.pauseGame();

        pauseGameButton.addEventListener('click', this.pauseGame);
        newGameButton.addEventListener('click', this.beginNewGame);
    },

    createDices(layout) {
        const fragment = document.createDocumentFragment();
        let gameLayout = this.layout.slice();
        gameLayout = this.shuffleArray(gameLayout); // Shuffle dice
        gameLayout.forEach((dice, ind) => {
            const diceElement = document.createElement("div");

            // Add classes
            diceElement.classList.add("dice");
            diceElement.textContent = `${gameLayout[ind]}`;
            const getContent = diceElement.textContent;
            switch (getContent) {
                case '' : // if empty
                    diceElement.textContent = '';
                    diceElement.classList.add('empty');
                    break
                default: // if dice with number
                    diceElement.textContent = gameLayout[ind];
                    diceElement.addEventListener('click', (e) => {
                        this.move(e.target);
                    })
                    break
            }

            fragment.appendChild(diceElement);
        });

        return fragment
    },

    move(el) {
        document.querySelectorAll('dice');
        const findPrevious = (el) => {
            do {
                el = el.previousSibling
            } while (el && el.nodeType != 1)
            return el
        }
        const findNext = (el) => {
            do {
                el = el.nextElementSibling
            } while (el && el.nodeType != 1)
            return el
        }
        if (el.previousElementSibling && el.previousElementSibling.textContent === '') {
            if (el.offsetTop !== el.previousElementSibling.offsetTop) { // Check that empty and clicked dices on one line
                return
            }
            this.countMove();
            this.properties.emptyPosition = this.getPosition('.dice', 'empty');
            this.properties.emptyPosition = this.properties.emptyPosition + 2;
            this.properties.verticalNeighborUnder = el.parentNode.childNodes[this.properties.emptyPosition + 3];
            this.properties.verticalNeighborAbove = el.parentNode.childNodes[this.properties.emptyPosition - 5];
            let previous = findPrevious(el);
            if (previous) {
                el.parentNode.insertBefore(el, previous);
            }
        } else if (el.nextElementSibling && el.nextElementSibling.textContent === '') {
            if (el.offsetTop !== el.nextElementSibling.offsetTop) { // Check that empty and clicked dices on one line
                return
            }
            this.countMove();
            this.properties.emptyPosition = this.getPosition('.dice', 'empty');
            this.properties.verticalNeighborUnder = el.parentNode.childNodes[this.properties.emptyPosition + 3];
            this.properties.verticalNeighborAbove = el.parentNode.childNodes[this.properties.emptyPosition - 5];
            let next = findNext(el);
            if (next) {
                el.parentNode.insertBefore(el.nextElementSibling, el);
            }
        } else if (el === this.properties.verticalNeighborAbove) {
            this.countMove();
            this.properties.emptyPosition = this.getPosition('.dice', 'empty');
            this.swapElements(el, document.querySelector('.empty'));
            this.properties.verticalNeighborUnder = this.properties.verticalNeighborAbove;
            this.properties.verticalNeighborAbove = el.parentNode.childNodes[this.properties.emptyPosition - 8];
        } else if (el === this.properties.verticalNeighborUnder) {
            this.countMove();
            this.properties.emptyPosition = this.getPosition('.dice', 'empty');
            this.swapElements(el, document.querySelector('.empty'));
            this.properties.verticalNeighborAbove = this.properties.verticalNeighborUnder;
            this.properties.verticalNeighborUnder = document.querySelector('.empty').parentNode.childNodes[this.properties.emptyPosition + 8];
        }
        this.checkForWin();
    },

    swapElements(obj1, obj2) {
        let temp = document.createElement("div");
        obj1.parentNode.insertBefore(temp, obj1);
        // move obj1 to right before obj2
        obj2.parentNode.insertBefore(obj1, obj2);
        // move obj2 to right before where obj1 used to be
        temp.parentNode.insertBefore(obj2, temp);
        // remove temporary marker node
        temp.parentNode.removeChild(temp);
    },

    checkForWin() {
        document.querySelectorAll('.dice').forEach(it => this.properties.currentSequence.push(it.textContent));
        if (this.properties.currentSequence.join(' ') === this.layout.join(' ')) {
            alert('Поздравляем, Вы победили!!! Ура');
        };
        this.properties.currentSequence = [];
    },

    // Generate templates
    renderTemplate(container, template, place = `beforeend`) {
        container.insertAdjacentHTML(place, template);
    },

    createControls() {
        return (
            `    <div class="game-controls">
        <div class="time"><span id="minutes">${this.properties.minutes}</span>:<span id="seconds">${this.properties.seconds}</span></div>
        <div class="game-controls__move">
           <span>Moves: </span><span id="moveCount">${this.properties.moves}</span>
        </div>
        <button id="pauseButton">Pause</button>
    </div>`
        )
    },

    createOverlayMenu() {
        return(
            `<button id="newGame">New Game</button>`
        )
    },

    // Game function

    startTimer() {
        const addZero = (numb) => {
            return (parseInt(numb, 10) < 10 ? '0' : '') + numb;
        }
        if (!Gameboard.properties.isPaused) {
            let second = document.querySelector('#seconds');
            let minute = document.querySelector('#minutes');
            if (Number(Gameboard.properties.seconds) === 59) {
                Gameboard.properties.minutes++
                minute.innerHTML = Gameboard.properties.minutes;
                minute.innerHTML = addZero(minute.innerHTML);
                Gameboard.properties.seconds = 0;
                second.innerHTML = Gameboard.properties.second;
            }
            Gameboard.properties.seconds++
            second.innerHTML = Gameboard.properties.seconds;
            second.innerHTML = addZero(second.innerHTML);
        }
    },

    countMove() {
        let moveCount = document.querySelector('#moveCount');
        Gameboard.properties.moves++;
        moveCount.innerHTML = Gameboard.properties.moves
    },

    pauseGame() {
        Gameboard.properties.isPaused = !Gameboard.properties.isPaused;
        Gameboard.elements.gameBoardOverlay.classList.toggle('overlay--show');
    },

    beginNewGame() {
        Gameboard.elements.diceContainer.remove();
        Gameboard.elements.diceContainer = null;
        Gameboard.elements.gameBoardOverlay.remove();
        Gameboard.elements.gameBoardOverlay = null;
        document.querySelector('.game-controls').remove();
        Gameboard.properties.minutes = '00';
        Gameboard.properties.seconds = '00';
        Gameboard.properties.moves = '0';
        clearInterval(Gameboard.properties.timerId);
        Gameboard.init();
        Gameboard.properties.isPaused = false;
        Gameboard.elements.gameBoardOverlay.classList.remove('overlay--show');
    }
}

window.addEventListener("DOMContentLoaded", () => {
    Gameboard.init();
})
