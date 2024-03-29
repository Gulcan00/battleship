import Gameboard from '../modules/Gameboard';

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

test('Edge case place ship vertical', () => {
  const row = 8;
  const col = 1;
  expect(() => gameboard.placeShip(row, col, 'carrier')).toThrow(
    'Ship does not fit'
  );
});

test('Attacks a ship with row outside board', () => {
  const row = -1;
  const col = 0;
  expect(() => gameboard.receiveAttack(row, col)).toThrow('Row out of board');
});

test('Attacks a ship with column outside board', () => {
  const row = 4;
  const col = 20;
  expect(() => gameboard.placeShip(row, col)).toThrow('Column out of board');
});

test('A cell that has been attacked', () => {
  gameboard.receiveAttack(0, 0);
  expect(gameboard.hasCellBeenAttacked(0, 0)).toBe(true);
});

test('A cell has not been attacked', () => {
  expect(gameboard.hasCellBeenAttacked(0, 0)).toBe(false);
});

test('Place a ship on horizontal axis', () => {
  const row = 0;
  const col = 0;
  gameboard.placeShip(row, col, 'battleship', 'horizontal');
  const expectedBoard = createEmptyBoard();
  for (let i = col; i < 4; i += 1) {
    expectedBoard[row][i] = 'battleship';
  }

  expect(gameboard.getBoard()).toEqual(expectedBoard);
});

test('Prevent overlap of ship vertical', () => {
  const row = 0;
  const col = 0;
  gameboard.placeShip(row, col, 'patrolBoat');
  expect(() => gameboard.placeShip(row + 1, col, 'battleship')).toThrow(
    'A ship already exists'
  );
});

test('Prevent overlap of ship horizontal', () => {
  const row = 1;
  const col = 8;
  gameboard.placeShip(row, col, 'patrolBoat', 'horizontal');
  expect(() =>
    gameboard.placeShip(row, col, 'patrolBoat', 'horizontal')
  ).toThrow('A ship already exists');
});

test('Edge case place ship horizontal', () => {
  const row = 1;
  const col = 8;
  expect(() => gameboard.placeShip(row, col, 'carrier', 'horizontal')).toThrow(
    'Ship does not fit'
  );
});

test('Randomly places all ships', () => {
  gameboard.randomlyPlaceShips();
  const board = gameboard.getBoard();
  const flatBoard = board.flat();

  const carrierCount = flatBoard.filter((cell) => cell === 'carrier').length;
  expect(carrierCount).toBe(5);

  const battleshipCount = flatBoard.filter(
    (cell) => cell === 'battleship'
  ).length;
  expect(battleshipCount).toBe(4);

  const destroyerCount = flatBoard.filter(
    (cell) => cell === 'destroyer'
  ).length;
  expect(destroyerCount).toBe(3);

  const submarineCount = flatBoard.filter(
    (cell) => cell === 'submarine'
  ).length;
  expect(submarineCount).toBe(3);

  const patrolBoatCount = flatBoard.filter(
    (cell) => cell === 'patrolBoat'
  ).length;
  expect(patrolBoatCount).toBe(2);
});

test('Valid placement, invalid placement then valid placement', () => {
  gameboard.placeShip(3, 3, 'battleship');
  expect(() => gameboard.placeShip(2, 3, 'carrier')).toThrow(
    'A ship already exists'
  );
  gameboard.placeShip(3, 4, 'carrier');
  const board = gameboard.getBoard().flat();

  const battleshipCount = board.filter((cell) => cell === 'battleship').length;
  expect(battleshipCount).toBe(4);

  const carrierCount = board.filter((cell) => cell === 'carrier').length;
  expect(carrierCount).toBe(5);
});
