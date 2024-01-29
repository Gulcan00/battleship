import Game from './modules/Game';
import './style.css';

function displayBoard(board, onClick = null, isComputer = false) {
  const div = document.createElement('div');
  div.classList.add('board');

  board.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      const btn = document.createElement('button');
      if (cell === 'hit' || cell === 'miss' || (cell && !isComputer)) {
        btn.classList.add(cell);
      }
      btn.innerText = '';
      btn.dataset.row = rowIndex;
      btn.dataset.col = colIndex;
      btn.ariaLabel = `Row ${rowIndex}, Column ${colIndex}`;
      if (onClick) {
        btn.addEventListener('click', onClick);
      }
      div.appendChild(btn);
    })
  );
  return div;
}

function getPlayerName() {
  return new Promise((resolve) => {
    const nameDiv = document.createElement('dialog');
    const form = document.createElement('form');
    const label = document.createElement('label');
    label.innerText = 'Name';
    label.htmlFor = 'name';
    const input = document.createElement('input');
    input.name = 'name';
    input.id = 'name';
    const submit = document.createElement('button');
    submit.innerText = 'Submit';
    submit.classList.add('button');

    form.append(label);
    form.appendChild(input);
    form.appendChild(submit);
    nameDiv.appendChild(form);
    const body = document.querySelector('body');
    body.appendChild(nameDiv);

    nameDiv.showModal();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      nameDiv.close();
      resolve(name);
    });
  });
}

function updateMessage(element, text) {
  const tempElement = element;
  tempElement.innerText = '';
  tempElement.innerText = text;
}

function domController() {
  let game;
  const ships = [
    { name: 'carrier', length: 5 },
    { name: 'battleship', length: 4 },
    { name: 'destroyer', length: 3 },
    { name: 'submarine', length: 3 },
    { name: 'patrolBoat', length: 2 },
  ];
  const body = document.querySelector('body');
  let orientation = 'vertical';
  let currentShipIndx = 0;

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
  changeOrientationBtn.classList.add('button');
  changeOrientationBtn.innerText = orientation;
  changeOrientationBtn.addEventListener('click', () => {
    const newOrientation =
      orientation === 'vertical' ? 'horizontal' : 'vertical';
    orientation = newOrientation;
    changeOrientationBtn.innerText = orientation;
  });

  const resetBoardBtn = document.createElement('button');
  resetBoardBtn.classList.add('button');
  resetBoardBtn.innerText = 'Reset';

  const restartDialog = document.createElement('dialog');
  const restart = document.createElement('button');
  restart.classList.add('button');
  restart.innerText = 'Restart Game';
  restartDialog.appendChild(restart);
  body.appendChild(restartDialog);

  const resultTxt = (value) => (value === 'hit' ? 'hits' : 'misses');

  function initialScreen(onClick) {
    messageDiv.innerText = `Place your ${ships[currentShipIndx].name} [Length: ${ships[currentShipIndx].length}]`;

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.alignItems = 'center';
    div.appendChild(messageDiv);
    div.appendChild(changeOrientationBtn);
    div.appendChild(resetBoardBtn);
    body.appendChild(div);

    const initialBoard = displayBoard(game.player1Board.getBoard(), onClick);
    initialBoard.classList.add('player', 'initial');

    body.appendChild(initialBoard);
  }

  function updateScreen() {
    boards.replaceChildren();
    const getWinner = game.checkWinner();
    if (getWinner) {
      const loser = getWinner === 'Computer' ? game.player1.name : 'Computer';
      updateMessage(
        messageDiv,
        `${game.checkWinner()} sunk all of ${loser}'s ships!`
      );
      restartDialog.showModal();
      return;
    }

    const computerBoard = displayBoard(
      game.player2Board.getBoard(),
      (e) => {
        const { row, col } = e.target.dataset;
        if (!game.player2Board.hasCellBeenAttacked(row, col)) {
          game.player1.attack(row, col);
          const computerCell = game.player2Board.getBoard()[row][col];
          const playerTxt = `${game.player1.name} shoots and ${resultTxt(
            computerCell
          )}!`;
          updateMessage(messageDiv, playerTxt);
          updateScreen();
          setTimeout(() => {
            if (!getWinner) {
              const [computerRow, computerCol] = game.player2.attack();
              const playerCell =
                game.player1Board.getBoard()[computerRow][computerCol];
              const computerTxt = `${game.player2.name} shoots and ${resultTxt(
                playerCell
              )}!`;
              updateMessage(messageDiv, computerTxt);
              updateScreen();
            }
          }, 2000);
        }
      },
      true
    );

    const playerBoard = displayBoard(game.player1Board.getBoard());
    playerBoard.classList.add('player');
    boards.appendChild(playerBoard);
    boards.appendChild(computerBoard);
  }

  function updatePlaceShipsBoard(onClick) {
    const currentBoard = document.querySelector('.board');
    body.removeChild(currentBoard);

    const updatedBoard = displayBoard(game.player1Board.getBoard(), onClick);
    updatedBoard.classList.add('player', 'initial');
    body.appendChild(updatedBoard);
  }

  const handleCellClick = (e) => {
    const { row, col } = e.target.dataset;
    e.target.classList.remove('invalid');
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
        updateMessage(
          messageDiv,
          `Place your ${ships[currentShipIndx].name} [Length: ${ships[currentShipIndx].length}]`
        );
      } else {
        const currentBoard = document.querySelector('.board');
        body.removeChild(currentBoard);
        const div = document.querySelector('.message-container').parentNode;
        div.removeChild(changeOrientationBtn);
        div.removeChild(resetBoardBtn);
        messageDiv.innerText = null;
        body.appendChild(boards);
        updateScreen();
      }
    } catch {
      e.target.classList.add('invalid');
    }
  };

  restart.addEventListener('click', () => {
    restartDialog.close();
    getPlayerName().then((name) => {
      game = Game(name || undefined);
      currentShipIndx = 0;
      messageDiv.innerText = '';
      body.removeChild(boards);
      initialScreen(handleCellClick);
    });
  });

  resetBoardBtn.addEventListener('click', () => {
    const { name } = game.player1;
    game = Game(name || undefined);
    updatePlaceShipsBoard(handleCellClick);
    currentShipIndx = 0;
    updateMessage(messageDiv, `Place your ${ships[currentShipIndx].name}`);
  });

  getPlayerName().then((name) => {
    game = Game(name || undefined);
    initialScreen(handleCellClick);
  });
}

domController();
