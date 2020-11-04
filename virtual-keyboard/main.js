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
        "caps", "en", "shift", "space", "speechRecord", "left", "right"
    ],
    keyRuLayout: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "ё", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "<", ">", "/",
        "caps", "ru", "shift", "space", "speechRecord", "left", "right"
    ],

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false,
        record: false
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
                this.soundEl('assets/sound/done.mp3');
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
                    const switchLanguage = () => {
                        this.soundEl('assets/sound/caps-shift-lang.mp3')
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
                    }
                    keyElement.addEventListener("click", switchLanguage);

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("arrow_drop_up");
                    const doShift = () => {
                        this._toggleShift();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
                        this.soundEl('assets/sound/caps-shift-lang.mp3');
                    }
                    keyElement.addEventListener("click", doShift);
                    this.listenKeyboardButton('shift', keyElement, doShift);
                    break;

                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    const eraseSimbol = () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                        this.soundEl('assets/sound/backspace.mp3');
                    }
                    keyElement.addEventListener("click", eraseSimbol);

                    function eraseFromKeyboard(e) {
                        if (keyElement.textContent.toLowerCase() === e.key.toLowerCase()){
                            eraseSimbol();
                            keyElement.style.backgroundColor = '#4a4a4a';
                            keyElement.style.backgroundColor = 'box-shadow: 0px 3px 1px 0 #151414 inset'
                            setTimeout(() => {
                                keyElement.style.backgroundColor = '#8d8d8d';
                            }, 200)
                        }
                    }
                    document.querySelector('html').onkeydown = eraseFromKeyboard;

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    const capsSwitcher = () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        this.soundEl('assets/sound/caps-shift-lang.mp3')
                    }
                    keyElement.addEventListener("click", capsSwitcher);
                    this.listenKeyboardButton('capslock', keyElement, capsSwitcher);

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    const returnLine = (e) => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                        this.soundEl('assets/sound/space.mp3');
                    }
                    keyElement.addEventListener("click", returnLine);
                    function returnLineFromKeyboard(e) {
                        if (e.key === 'Enter') {
                            returnLine()
                            keyElement.style.backgroundColor = '#4a4a4a';
                            keyElement.style.backgroundColor = 'box-shadow: 0px 3px 1px 0 #151414 inset'
                            setTimeout(() => {
                                keyElement.style.backgroundColor = '#8d8d8d';
                            }, 200)
                        }
                    }

                    document.querySelector('body').onkeydown = returnLineFromKeyboard;
                    // this.listenKeyboardButton('enter', keyElement, returnLine);

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    const spaceButton = () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                        this.soundEl('assets/sound/return.mp3');
                    }
                    keyElement.addEventListener("click", spaceButton);
                    this.listenKeyboardButton(' ', keyElement, spaceButton);

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                        this.soundEl('assets/sound/done.mp3');
                    });

                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");
                    const moveCursorLeft = () => {
                        const area = document.getElementsByName('textarea').item(0);
                        area.selectionEnd = area.selectionEnd - 1;
                        area.focus();
                        this.soundEl('assets/sound/backspace.mp3');
                    }
                    keyElement.addEventListener('click', moveCursorLeft);
                    this.listenKeyboardButton('arrowleft', keyElement, moveCursorLeft);

                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");
                    const moveCursorRigth = () => {
                        const area = document.getElementsByName('textarea').item(0);
                        area.selectionStart = area.selectionEnd + 1;
                        area.focus();
                        this.soundEl('assets/sound/backspace.mp3');
                    }
                    keyElement.addEventListener('click', moveCursorRigth);
                    this.listenKeyboardButton('arrowright', keyElement, moveCursorRigth);

                    break;

                case "speechRecord":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("record_voice_over");
                    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    keyElement.addEventListener('click', (e) => {
                        this.soundEl('assets/sound/record.mp3')
                        this.properties.record = !this.properties.record;
                        keyElement.classList.toggle("keyboard__key--active--record", this.properties.record);
                        const recognition = new SpeechRecognition();
                        recognition.interimResults = true;
                        recognition.lang = this.language.value + '-' + this.language.value.toUpperCase();
                        recognition.addEventListener('result', e => {
                            const transcript = Array.from(e.results)
                                .map(result => result[0])
                                .map(result => result.transcript)
                                .join('');

                            if (e.results[0].isFinal) {
                                this.properties.value += transcript + " ";
                                this._triggerEvent("oninput");
                            }
                        });

                        recognition.addEventListener('end', () => {
                            this.properties.record = !this.properties.record;
                            keyElement.classList.toggle("keyboard__key--active--record", this.properties.record);
                            recognition.stop();
                        })

                        recognition.start();
                    })

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    const typeFromKeyboard = (el) => {
                        if (this.properties.capsLock && !this.properties.shift) {
                            this.properties.value += el.toUpperCase();
                        } else if (!this.properties.capsLock && this.properties.shift) {
                            this.properties.value += el.toUpperCase();
                        } else {
                            this.properties.value += el.toLowerCase();
                        }
                        this._triggerEvent("oninput");
                        this.language.value === 'en' ? this.soundEl('assets/sound/keydownEn.mp3') : this.soundEl('assets/sound/keydownRu.mp3');
                    }

                    keyElement.addEventListener("click", () => {
                        typeFromKeyboard(keyElement.textContent)
                    });

                    // Не мог избавится от размножения eventListener, поэтому пришлось делать такой костыль
                function lighting(e) {
                    document.querySelectorAll('.keyboard__key').forEach((key) => {
                        if (key.textContent.toLowerCase() === e.key) {
                            typeFromKeyboard(key.textContent);
                            key.style.backgroundColor = '#4a4a4a';
                            key.style.backgroundColor = 'box-shadow: 0px 3px 1px 0 #151414 inset'
                            setTimeout(() => {
                                key.style.backgroundColor = '#8d8d8d';
                            }, 200)
                        }
                    })
                }

                    document.querySelector('.use-keyboard-input').onkeydown = lighting;

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
    },

    listenKeyboardButton(el, keyEl, cb) {
        document.addEventListener("keydown", (evt) => {
            evt.preventDefault();
            let target = evt.key.toLowerCase();
            if (target === el) {
                keyEl.style.backgroundColor = '#4a4a4a';
                setTimeout(() => {
                    keyEl.style.backgroundColor = '#8d8d8d';
                }, 100)
                cb();
            }
        });
    },

    soundEl(src) {
        const audio = new Audio();
        audio.src = src;
        audio.autoplay = true;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Keyboard.init();
})

