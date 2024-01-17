import Game from './modules/Game';
import './style.css';

function displayBoard(board, onClick = null) {
  const div = document.createElement('div');
  div.classList.add('board');

  board.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      const btn = document.createElement('button');
      if (cell) {
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

function typeWriter(element, text, speed = 50, i = 0) {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    setTimeout(() => typeWriter(element, text, speed, i + 1), speed);
  }
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

  const boards = document.createElement('div');
  boards.classList.add('boards-container');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message-container');

  const changeOrientationBtn = document.createElement('button');
  changeOrientationBtn.classList.add('change-orientation');
  changeOrientationBtn.innerText = orientation;
  changeOrientationBtn.addEventListener('click', () => {
    const newOrientation =
      orientation === 'vertical' ? 'horizontal' : 'vertical';
    orientation = newOrientation;
    changeOrientationBtn.innerText = orientation;
  });

  const resultTxt = (value) => (value === 'hit' ? 'hits' : 'misses');

  function updateScreen() {
    boards.replaceChildren();
    const computerBoard = displayBoard(game.player2Board.getBoard(), (e) => {
      const { row, col } = e.target.dataset;
      if (!game.player2Board.hasCellBeenAttacked(row, col)) {
        game.player1.attack(row, col);
        const computerCell = game.player2Board.getBoard()[row][col];
        const playerTxt = `${game.player1.name} shoots and ${resultTxt(
          computerCell
        )}!`;
        messageDiv.innerText = '';
        typeWriter(messageDiv, playerTxt);
        updateScreen();

        setTimeout(() => {
          const [computerRow, computerCol] = game.player2.attack();
          const playerCell =
            game.player1Board.getBoard()[computerRow][computerCol];
          const computerTxt = `${game.player2.name} shoots and ${resultTxt(
            playerCell
          )}!`;
          messageDiv.innerText = '';
          typeWriter(messageDiv, computerTxt);
          updateScreen();
        }, 2000);
      }
    });

    const playerBoard = displayBoard(game.player1Board.getBoard());
    playerBoard.classList.add('player');
    boards.appendChild(playerBoard);
    boards.appendChild(computerBoard);

    if (game.checkWinner()) {
      // eslint-disable-next-line no-alert
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
    updatedBoard.classList.add('player', 'initial');
    body.appendChild(updatedBoard);
  }

  const handleCellClick = (e) => {
    const { row, col } = e.target.dataset;
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
        messageDiv.innerText = '';
        typeWriter(messageDiv, text, 50);
      } else {
        const currentBoard = document.querySelector('.board');
        body.removeChild(currentBoard);
        const div = document.querySelector('.message-container').parentNode;
        div.removeChild(changeOrientationBtn);
        messageDiv.innerText = null;
        body.appendChild(boards);
        updateScreen();
      }
    } catch {
      e.target.classList.add('invalid');
    }
  };

  function initialScreen() {
    const text = `Place your ${ships[currentShipIndx].name}`;
    typeWriter(messageDiv, text, 50);

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.alignItems = 'center';
    div.appendChild(messageDiv);
    div.appendChild(changeOrientationBtn);
    body.appendChild(div);

    const initialBoard = displayBoard(
      game.player1Board.getBoard(),
      handleCellClick
    );
    initialBoard.classList.add('player', 'initial');

    body.appendChild(initialBoard);
  }

  initialScreen();
}

domController();
