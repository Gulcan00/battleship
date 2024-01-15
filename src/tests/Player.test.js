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
