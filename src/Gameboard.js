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
  let board = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(null));

  function getBoard() {
    return board;
  }

  function placeShip(row, col, shipName) {
    if (row < 0 || row >= BOARD_SIZE) {
      throw new Error('Row out of board');
    }
    if (col < 0 || col >= BOARD_SIZE) {
      throw new Error('Column out of board');
    }

    const newBoard = board.slice();
    const shipLength = ships[shipName].length;
    for (let i = row; i < row + shipLength; i += 1) {
      newBoard[i][col] = shipName;
    }

    board = newBoard;
  }

  return {
    getBoard,
    placeShip,
  };
}
