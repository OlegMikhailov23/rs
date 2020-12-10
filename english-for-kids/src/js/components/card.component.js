import render from '../helper/helper.render';

class Card {
  constructor() {
    this.sound = new Audio();
  }

  setContainer(el) {
    this.container = el;
  }

  setCardWrap(el) {
    this.cardContainer = el;
  }

  setText(el) {
    this.text = el;
  }

  speak(src) {
    this.sound.src = `./assets/audio/${src}.mp3`;
    this.sound.autoplay = true;
  }

  initCard(it, cb) {
    const cardContainer = document.querySelector('.game-board__wrapper');
    this.setContainer(cardContainer);
    render(this.container, cb, 'afterbegin');
  }
}

export default Card;
