import Game from './modules/Game';
import './style.css';

function displayBoard(board) {
  const div = document.createElement('div');
  div.classList.add('board');
  board.forEach((row) =>
    row.forEach((cell) => {
      const btn = document.createElement('button');
      btn.innerText = cell;
      div.appendChild(btn);
    })
  );
  return div;
}

function domController() {
  const game = Game();
  const bod = document.querySelector('body');
  bod.appendChild(displayBoard(game.player1Board.getBoard()));
}

domController();
