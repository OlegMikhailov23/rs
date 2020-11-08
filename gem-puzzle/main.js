'use strict';

const Gameboard = {
    elements: {
        diceContainer: null,
        dices: []
    },

    layout: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", ""
    ],

    properties: {
        fieldSize: 16
    },

    shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        return arr;
    },

    init() {
        this.elements.diceContainer = document.createElement("div"); // Create container for dices

        this.elements.diceContainer.classList.add("game-board");

        this.elements.diceContainer.appendChild(this.createDices(this.layout));

        this.elements.dices = this.elements.diceContainer.querySelectorAll('.dice');

        document.body.appendChild(this.elements.diceContainer);
    },

    createDices(layout) {
        const fragment = document.createDocumentFragment();
        layout = this.shuffleArray(layout); // Shuffle dice
        layout.forEach((dice, ind) => {
            const diceElement = document.createElement("div");

            // Add classes
            diceElement.classList.add("dice");
            diceElement.textContent = `${layout[ind]}`;
            const getContent = diceElement.textContent;
            switch (getContent) {
                case '' : // if empty
                    diceElement.textContent = '';
                    diceElement.classList.add('empty');
                    break
                default: // if dice with number
                    diceElement.textContent = layout[ind];
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
        let emptyPosition = [...document.querySelectorAll('.dice')].findIndex(n => n.classList.contains('empty')); // Let to know where are we
            if (el.previousElementSibling && el.previousElementSibling.textContent === '') {
                console.log(el.parentNode.childNodes[emptyPosition - 3], el.parentNode.childNodes[emptyPosition + 5]);
                emptyPosition = emptyPosition + 2;
                    let previous = findPrevious(el);
                    if (previous) {
                        el.parentNode.insertBefore(el, previous);
                }
            } else if (el.nextElementSibling.textContent === '') {
                console.log(emptyPosition);
                console.log(el.parentNode.childNodes[emptyPosition -5], el.parentNode.childNodes[emptyPosition + 3]);
                let next = findNext(el);
                if (next) {
                    el.parentNode.insertBefore(el.nextElementSibling, el);
                }
            }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    Gameboard.init();
})
