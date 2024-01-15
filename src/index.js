import Game from './modules/Game';
import './style.css';

function displayBoard(board, onClick = null) {
  const div = document.createElement('div');
  div.classList.add('board');
  board.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      const btn = document.createElement('button');
      if (cell) {
        btn.innerText = cell;
      } else {
        btn.innerText = ' _ ';
      }
      btn.dataset.row = rowIndex;
      btn.dataset.col = colIndex;
      if (onClick) {
        btn.addEventListener('click', onClick);
      }
      div.appendChild(btn);
    })
  );
  return div;
}

function domController() {
  let game = Game();
  const body = document.querySelector('body');
  const boards = document.createElement('div');
  boards.classList.add('boardsContainer');
  body.appendChild(boards);

  function updateScreen() {
    boards.innerHTML = null;
    const player2Board = displayBoard(game.player2Board.getBoard(), (e) => {
      const { row } = e.target.dataset;
      const { col } = e.target.dataset;
      if (!game.player2Board.hasCellBeenAttacked(row, col)) {
        game.player1.attack(row, col);
        game.player2.attack();
        updateScreen();
      }
    });

    const player1Board = displayBoard(game.player1Board.getBoard());
    boards.appendChild(player1Board);
    boards.appendChild(player2Board);

    if (game.checkWinner()) {
      console.log(game.checkWinner());
      game = Game();
      updateScreen();
    }
  }

  updateScreen();
}

domController();
