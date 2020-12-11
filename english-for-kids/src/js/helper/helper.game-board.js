const helperGameBoard = {
  clearGameBoard() {
    document.querySelector('.game-board__wrapper').remove();
  },

  clearStar() {
    document.querySelectorAll('.game-board__star-container__star').forEach((it) => {
      it.remove();
    });
  },

  disableIt(el) {
    el.classList.add('disabled');
  },
};

export default helperGameBoard;
