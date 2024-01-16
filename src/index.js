import Game from './modules/Game';
import './style.css';

function displayBoard(board, onClick = null) {
  const div = document.createElement('div');
  div.classList.add('board');
  if (!onClick) {
    div.classList.add('player');
  }
  board.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      const btn = document.createElement('button');
      if (cell === 'hit') {
        btn.classList.add('hit');
      } else if (cell === 'miss') {
        btn.classList.add('miss');
      } else if (cell) {
        btn.classList.add(cell);
      }
      btn.innerText = '';
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
  const ships = [
    { name: 'carrier', length: 5 },
    { name: 'battleship', length: 4 },
    { name: 'destroyer', length: 3 },
    { name: 'submarine', length: 3 },
    { name: 'patrolBoat', length: 2 },
  ];
  let orientation = 'vertical';
  const body = document.querySelector('body');

  const title = document.createElement('h1');
  title.innerText = 'BATTLESHIP';
  title.style.textAlign = 'center';
  title.style.fontSize = '48px';
  body.appendChild(title);

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('messageContainer');
  body.appendChild(messageDiv);

  const boards = document.createElement('div');
  boards.classList.add('boardsContainer');
  body.appendChild(boards);

  function typeWriter(text, speed, i = 0) {
    if (i < text.length) {
      messageDiv.innerHTML += text.charAt(i);
      setTimeout(() => typeWriter(text, speed, i + 1), speed);
    }
  }

  let currentShipIndx = 0;
  function placeShips() {
    let text = `Place your ${ships[currentShipIndx].name}`;
    typeWriter(text, 50);

    const initialBoard = displayBoard(
      game.player1Board.getBoard(),
      handleCellClick
    );

    body.appendChild(initialBoard);
  }

  function updatePlaceShipsBoard() {
    const currentBoard = document.querySelector('.board');
    body.removeChild(currentBoard);

    const updatedBoard = displayBoard(
      game.player1Board.getBoard(),
      handleCellClick
    );
    updatedBoard.classList.add('player');
    body.appendChild(updatedBoard);
  }

  const handleCellClick = (e) => {
    const { row } = e.target.dataset;
    const { col } = e.target.dataset;
    try {
      game.player1Board.placeShip(
        parseInt(row, 10),
        parseInt(col, 10),
        ships[currentShipIndx].name,
        orientation
      );
      updatePlaceShipsBoard();
      currentShipIndx += 1;
      if (currentShipIndx < ships.length) {
        const text = `Place your ${ships[currentShipIndx].name}`;
        messageDiv.innerHTML = null;
        typeWriter(text, 50);
      } else {
        const currentBoard = document.querySelector('.board');
        body.removeChild(currentBoard);
        updateScreen();
      }
    } catch (e) {}
  };

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
      alert(`${game.checkWinner()} won!!!!`);
      game = Game();
      updateScreen();
    }
  }

  placeShips();
}

domController();
