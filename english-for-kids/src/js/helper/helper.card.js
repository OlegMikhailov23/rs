const helperCard = {
  flipCard(card) {
    card.classList.add('is-flipped');
  },

  flipCardBack(card) {
    if (card) {
      card.classList.remove('is-flipped');
    }
  },
  startFlipCard() {
    document.querySelectorAll('.rotate').forEach((it) => {
      it.addEventListener('click', (e) => {
        helperCard.flipCard(e.target.closest('.game-board__item-container'));
        this.startFlipCardBack();
      });
    });
  },

  startFlipCardBack() {
    document.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('game-board__wrapper') && e.relatedTarget) {
        this.flipCardBack(e.relatedTarget.closest('.is-flipped'));
      }
    });
  },
};

export default helperCard;
