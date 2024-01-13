import Gameboard from '../Gameboard';

let gameboard;

beforeAll(() => {
  gameboard = Gameboard();
});

test('Initial board is 10 x 10 grid of null', () => {
  const initialBoard = Array(10).fill(Array(10).fill(null));
  expect(gameboard.getBoard()).toEqual(initialBoard);
});

test('Place a ship on the board', () => {
  const row = 0;
  const col = 0;
  gameboard.placeShip(row, col, 'battleship');
  const expectedBoard = Array(10).fill(Array(10).fill(null));
  for (let i = row; i < 4; i += 1) {
    expectedBoard[i][col] = 'battleship';
  }

  expect(gameboard.getBoard()).toEqual(expectedBoard);
});

test('Place a ship with row outside board', () => {
  const row = -1;
  const col = 0;
  expect(() => gameboard.placeShip(row, col, 'battleship')).toThrow(
    'Row out of board'
  );
});

test('Place a ship with column outside board', () => {
  const row = 4;
  const col = 20;
  expect(() => gameboard.placeShip(row, col, 'battleship')).toThrow(
    'Column out of board'
  );
});
