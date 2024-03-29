import Ship from './Ship';

export default function Gameboard() {
  const ships = {
    carrier: Ship(5),
    battleship: Ship(4),
    destroyer: Ship(3),
    submarine: Ship(3),
    patrolBoat: Ship(2),
  };

  const BOARD_SIZE = 10;
  let board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );

  function getBoard() {
    return board;
  }

  function placeShip(row, col, shipName, orientation = 'vertical') {
    if (row < 0 || row >= BOARD_SIZE) {
      throw new Error('Row out of board');
    }
    if (col < 0 || col >= BOARD_SIZE) {
      throw new Error('Column out of board');
    }

    const shipLength = ships[shipName].length;
    if (orientation === 'vertical') {
      if (row + shipLength > BOARD_SIZE) {
        throw new Error('Ship does not fit');
      }
    } else if (col + shipLength > BOARD_SIZE) {
      throw new Error('Ship does not fit');
    }

    const newBoard = board.slice();
    if (orientation === 'vertical') {
      for (let i = row; i < row + shipLength; i += 1) {
        if (newBoard[i][col]) {
          throw new Error('A ship already exists');
        }
      }

      for (let i = row; i < row + shipLength; i += 1) {
        newBoard[i][col] = shipName;
      }
    } else {
      for (let i = col; i < col + shipLength; i += 1) {
        if (newBoard[row][i]) {
          throw new Error('A ship already exists');
        }
      }

      for (let i = col; i < col + shipLength; i += 1) {
        newBoard[row][i] = shipName;
      }
    }

    board = newBoard;
  }

  function receiveAttack(row, col) {
    if (row < 0 || row >= BOARD_SIZE) {
      throw new Error('Row out of board');
    }
    if (col < 0 || col >= BOARD_SIZE) {
      throw new Error('Column out of board');
    }

    const newBoard = board.slice();
    if (newBoard[row][col] && Object.keys(ships).includes(newBoard[row][col])) {
      ships[newBoard[row][col]].hit();
      newBoard[row][col] = 'hit';
    } else if (!newBoard[row][col]) {
      newBoard[row][col] = 'miss';
    }
    board = newBoard;
  }

  function allIsSunk() {
    return Object.values(ships).every((ship) => ship.isSunk());
  }

  function hasCellBeenAttacked(row, col) {
    return board[row][col] === 'hit' || board[row][col] === 'miss';
  }

  function randomlyPlaceShips() {
    const orientations = ['vertical', 'horizontal'];
    Object.keys(ships).forEach((ship) => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        const orientation =
          orientations[Math.floor(Math.random() * orientations.length)];
        try {
          placeShip(row, col, ship, orientation);
          placed = true;
        } catch {
          // If placeShip throws an error, we just try again with new random row, col, and orientation
        }
      }
    });
  }

  return {
    getBoard,
    placeShip,
    receiveAttack,
    allIsSunk,
    hasCellBeenAttacked,
    randomlyPlaceShips,
  };
}
