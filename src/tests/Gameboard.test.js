import Gameboard from '../Gameboard';

let gameboard;
const BOARD_SIZE = 10;
const BATTLESHIP_SIZE = 4;

const createEmptyBoard = () =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

beforeEach(() => {
  gameboard = Gameboard();
});

test('Initial board is 10 x 10 grid of null', () => {
  const initialBoard = createEmptyBoard();
  expect(gameboard.getBoard()).toEqual(initialBoard);
});

test('Place a ship on the board', () => {
  const row = 0;
  const col = 0;
  gameboard.placeShip(row, col, 'battleship');
  const expectedBoard = createEmptyBoard();
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

test('Receives attack to a ship', () => {
  gameboard.placeShip(0, 0, 'battleship');
  gameboard.receiveAttack(0, 0);
  const expectedBoard = createEmptyBoard();
  for (let i = 0; i < BATTLESHIP_SIZE; i += 1) {
    expectedBoard[i][0] = 'battleship';
  }
  expectedBoard[0][0] = 'hit';
  expect(gameboard.getBoard()).toEqual(expectedBoard);
});

test('Sinks a ship', () => {
  gameboard.placeShip(0, 0, 'battleship');
  const expectedBoard = createEmptyBoard();

  for (let i = 0; i < BATTLESHIP_SIZE; i += 1) {
    gameboard.receiveAttack(i, 0);
    expectedBoard[i][0] = 'hit';
  }

  expect(gameboard.getBoard()).toEqual(expectedBoard);
});

test('Receives attack misses ship', () => {
  gameboard.placeShip(0, 0, 'battleship');
  const expectedBoard = createEmptyBoard();
  for (let i = 0; i < 4; i += 1) {
    expectedBoard[i][0] = 'battleship';
  }

  gameboard.receiveAttack(3, 4);
  expectedBoard[3][4] = 'miss';
  expect(gameboard.getBoard()).toEqual(expectedBoard);
});

test('All ships are sunk', () => {
  gameboard.placeShip(0, 0, 'battleship'); // size 4
  gameboard.placeShip(0, 1, 'carrier'); // size 5
  gameboard.placeShip(0, 2, 'destroyer'); // size 3
  gameboard.placeShip(0, 3, 'submarine'); // size 3
  gameboard.placeShip(0, 4, 'patrolBoat'); // size 2

  for (let i = 0; i < 4; i += 1) {
    gameboard.receiveAttack(i, 0); // attack battleship
  }

  for (let i = 0; i < 5; i += 1) {
    gameboard.receiveAttack(i, 1); // attack carrier
  }

  for (let i = 0; i < 3; i += 1) {
    gameboard.receiveAttack(i, 2); // attack destroyer
  }

  for (let i = 0; i < 3; i += 1) {
    gameboard.receiveAttack(i, 3); // attack submarine
  }

  for (let i = 0; i < 2; i += 1) {
    gameboard.receiveAttack(i, 4); // attack patrolBoat
  }

  expect(gameboard.allIsSunk()).toBe(true);
});
