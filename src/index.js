import Game from './modules/Game';
import './style.css';

function displayBoard(board, onClick = null) {
  const div = document.createElement('div');
  div.classList.add('board');

  board.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      const btn = document.createElement('button');
      btn.classList.add(cell);
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
  const body = document.querySelector('body');
  let orientation = 'vertical';

  // Add battleship title
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

  function updateScreen() {
    boards.innerHTML = null;
    const computerBoard = displayBoard(game.player2Board.getBoard(), (e) => {
      const { row } = e.target.dataset;
      const { col } = e.target.dataset;
      if (!game.player2Board.hasCellBeenAttacked(row, col)) {
        game.player1.attack(row, col);
        game.player2.attack();
        updateScreen();
      }
    });

    const playerBoard = displayBoard(game.player1Board.getBoard());
    playerBoard.classList.add('player');
    boards.appendChild(playerBoard);
    boards.appendChild(computerBoard);

    if (game.checkWinner()) {
      alert(`${game.checkWinner()} won!!!!`);
      game = Game();
      updateScreen();
    }
  }

  let currentShipIndx = 0;

  function updatePlaceShipsBoard(onClick) {
    const currentBoard = document.querySelector('.board');
    body.removeChild(currentBoard);

    const updatedBoard = displayBoard(game.player1Board.getBoard(), onClick);
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
      updatePlaceShipsBoard(handleCellClick);
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
    } catch {
      e.target.classList.add('invalid');
    }
  };

  function placeShips() {
    const text = `Place your ${ships[currentShipIndx].name}`;
    typeWriter(text, 50);

    const initialBoard = displayBoard(
      game.player1Board.getBoard(),
      handleCellClick
    );

    body.appendChild(initialBoard);
  }

  placeShips();
}

domController();
