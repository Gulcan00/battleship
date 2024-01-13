import Game from './modules/Game';
import './style.css';

function displayBoard(board) {
  const div = document.createElement('div');
  div.classList.add('board');
  board.forEach((row) =>
    row.forEach((cell) => {
      const btn = document.createElement('button');
      if (cell) {
        btn.innerText = cell;
      } else {
        btn.innerText = ' _ ';
      }

      div.appendChild(btn);
    })
  );
  return div;
}

function domController() {
  const game = Game();
  const body = document.querySelector('body');
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.gap = '20px';
  div.appendChild(displayBoard(game.player1Board.getBoard()));
  div.appendChild(displayBoard(game.player2Board.getBoard()));
  body.appendChild(div);
}

domController();
