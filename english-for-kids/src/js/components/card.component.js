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

  createCardCategory(cardItem) {
    return (
      `<div class="game-board__item-container">
         <div class="game-board__item" data-id="${cardItem}">
            <img src="./assets/img/${cardItem}.jpg" alt="${cardItem}">
            <span>${cardItem}</span>
         </div>
       </div>`
    );
  }

  createCard(cardItem) {
    return (
      `
       <div class="game-board__item-container">
           <div class="game-board__item game-board__item--front" sound-id="${cardItem.word}">
              <img class="game-board__item-img" src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
              <span class="game-board__item__text">${cardItem.word}</span>
              <div class="rotate" title="rotate">rotate</div>
           </div>
           <div class="game-board__item game-board__item--back">
              <img class="game-board__item-img" src="./assets/img/${cardItem.word}.jpg" alt="${cardItem.word}">
              <span class="game-board__item__text">${cardItem.translation}</span>
           </div>
       </div>`
    );
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  flipCard(card) {
    card.classList.add('is-flipped');
  }

  flipCardBack(card) {
    if (card) {
      card.classList.remove('is-flipped');
    }
  }

  speak(src) {
    this.sound.src = `./assets/audio/${src}.mp3`;
    this.sound.autoplay = true;
  }

  initCard(it, cb) {
    const cardContainer = document.querySelector('.game-board__wrapper');
    this.setContainer(cardContainer);
    this.render(this.container, cb, 'afterbegin');
  }
}

export default Card;
