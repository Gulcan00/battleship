import Player from '../modules/Player';

test('Set player name', () => {
  const player = Player({ name: 'john', gameboard: null });
  expect(player.name).toBe('john');
});

test('Gameboard receiveAttack is called when attack', () => {
  const receiveAttack = jest.fn();
  const gameboard = {
    receiveAttack,
  };
  const player = Player({ name: 'Sam', gameboard });
  player.attack(0, 0);
  expect(receiveAttack).toHaveBeenCalledWith(0, 0);
});

test('Computer tries adjacent slots after a hit', () => {
  const board = Array.from({ length: 10 }).fill(Array(10));
  const player1Board = {
    getBoard: () => board,
    receiveAttack: jest.fn((row, col) => {
      board[row][col] = 'hit';
    }),
  };
  const player = Player({
    name: 'Computer',
    gameboard: player1Board,
    isComputer: true,
  });

  const [row1, col1] = player.attack();
  const [row2, col2] = player.attack();
  expect(
    (row1 === row2 && Math.abs(col1 - col2) === 1) ||
      (col1 === col2 && Math.abs(row1 - row2) === 1)
  ).toBeTruthy();
});

test('Computer tries adjacent slots after a hit but not same move', () => {
  const board = Array.from({ length: 10 }).fill(Array(10));
  const player1Board = {
    getBoard: () => board,
    receiveAttack: jest.fn((row, col) => {
      board[row][col] = 'hit';
    }),
  };
  const player = Player({
    name: 'Computer',
    gameboard: player1Board,
    isComputer: true,
  });

  const move1 = player.attack();
  const move2 = player.attack();
  const move3 = player.attack();
  const move4 = player.attack();
  const move5 = player.attack();

  expect(move1).not.toEqual(move2);
  expect(move2).not.toEqual(move3);
  expect(move3).not.toEqual(move4);
  expect(move4).not.toEqual(move5);
});
