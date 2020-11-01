'use strict';

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    alternativeKeyboard: [
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "<", ">", "/"
    ],

    usualKeyboard: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ",", ".", "?"
    ],

    alternativeRuKeyboard: [
        "!", "'", "№", "%", ":", ",", ".", ";", "(", ")", "<", ">", "/"
    ],

    keyEnLayout: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
        "caps","en", "shift", "space", "left", "right"
    ],
    keyRuLayout: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ё", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "<", ">", "/",
        "caps","ru", "shift", "space", "left", "right"
    ],

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false,
    },

    language: {
        value: 'en',
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys(this.keyEnLayout, this.language.value));

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically usekeyboard for elements .use-keyboard-input
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('click', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        })
        document.querySelector('html').addEventListener('click', () => {
            document.querySelector('.use-keyboard-input').focus();
        })
    },

    _createKeys(layout) {
        const fragment = document.createDocumentFragment();
        // Creates HTML for an icon
        const createIconHTML = (iconName) => {
            return `<i class="material-icons">${iconName}</i>`;
        };

        layout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "ъ", "p", "enter", "?", "/"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case this.language.value :
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = this.language.value;
                    keyElement.addEventListener("click", () => {
                        this.properties.shift = false;
                        this.properties.capsLock = false;

                        document.querySelectorAll('.keyboard__key').forEach(key => {
                            key.remove()
                        });
                        document.querySelectorAll('br').forEach(it => {
                            it.remove();
                        })
                        if (keyElement.innerHTML.toLowerCase() === 'en') {
                            if (this.properties.capsLock && !this.properties.shift) {
                                keyElement.innerHTML = keyElement.innerHTML.toUpperCase();
                            } else if (!this.properties.capsLock && this.properties.shift) {
                                keyElement.innerHTML = keyElement.innerHTML.toUpperCase();
                            } else {
                                keyElement.innerHTML = keyElement.innerHTML.toLowerCase();
                            }
                            this.language.value = 'ru';
                            keyElement.innerHTML = 'ru';
                            this.elements.keysContainer.appendChild(this._createKeys(this.keyRuLayout));
                        } else if (keyElement.innerHTML.toLowerCase() === 'ru') {
                            if (this.properties.capsLock && !this.properties.shift) {
                                keyElement.innerHTML = keyElement.innerHTML.toUpperCase();
                            } else if (!this.properties.capsLock && this.properties.shift) {
                                keyElement.innerHTML = keyElement.innerHTML.toUpperCase();
                            } else {
                                keyElement.innerHTML = keyElement.innerHTML.toLowerCase();
                            }
                            this.language.value = 'en';
                            keyElement.innerHTML = 'en';
                            this.elements.keysContainer.appendChild(this._createKeys(this.keyEnLayout));
                        }

                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("arrow_drop_up");
                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
                    });

                    break;

                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;
                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");
                    keyElement.addEventListener('click', () => {
                            const area = document.getElementsByName('textarea').item(0);
                                area.selectionEnd = area.selectionEnd - 1;
                                area.focus();
                    })
                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");
                    keyElement.addEventListener('click', () => {
                        const area = document.getElementsByName('textarea').item(0);
                            area.selectionStart = area.selectionEnd +1;
                            area.focus();
                    })
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        if (this.properties.capsLock && !this.properties.shift) {
                            this.properties.value += keyElement.textContent.toUpperCase();
                        } else if (!this.properties.capsLock && this.properties.shift) {
                            this.properties.value += keyElement.textContent.toUpperCase();
                        } else {
                            this.properties.value += keyElement.textContent.toLowerCase();
                        }
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] === 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
        this.properties.capsLock = !this.properties.capsLock;
        this.checkShiftAndCaps();
    },

    _toggleShift() {
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
        this.properties.shift = !this.properties.shift;
        if (this.properties.shift) {
            let j = 0;
            for (let i = 0; i < document.querySelectorAll('.keyboard__key').length; i++) {
                if (this.elements.keys[i].textContent.search(/[a-zа-яёA-ZА-ЯЁ]/) === -1 && this.elements.keys[i].childElementCount === 0) {
                    this.language.value === 'en' ? this.elements.keys[i].textContent = this.alternativeKeyboard[j] : this.elements.keys[i].textContent = this.alternativeRuKeyboard[j];
                    j++
                }
            }
        } else {
            let j = 0;
            for (let i = 0; i < document.querySelectorAll('.keyboard__key').length; i++) {
                if (this.elements.keys[i].textContent.search(/^[a-zа-яёA-ZА-ЯЁ]/) === -1 && this.elements.keys[i].childElementCount === 0) {
                    this.elements.keys[i].textContent = this.usualKeyboard[j];
                    j++
                }
            }
        }

        this.checkShiftAndCaps();
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden')
    },

    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    },

    checkShiftAndCaps() {
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if (this.properties.capsLock && !this.properties.shift) {
                    key.textContent = key.textContent.toUpperCase();
                } else if (!this.properties.capsLock && this.properties.shift) {
                    key.textContent = key.textContent.toUpperCase();
                } else {
                    key.textContent = key.textContent.toLowerCase();
                }
            }
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Keyboard.init();
})