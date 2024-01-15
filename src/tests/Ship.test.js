import Ship from '../modules/Ship';

let ship;

beforeEach(() => {
  ship = Ship(4);
});

test('Creates ship with specified length', () => {
  expect(ship.length).toBe(4);
});

test('Ship is not sunk initially', () => {
  expect(ship.isSunk()).toBeFalsy();
});

test('Ship is not sunk with hits less than length', () => {
  for (let i = 0; i < 3; i += 1) {
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
  }
});

test('Ship is sunk with hits equal to length', () => {
  for (let i = 0; i < 4; i += 1) {
    ship.hit();
  }
  expect(ship.isSunk()).toBeTruthy();
});

test('Extra hits beyond length keep ship sunk', () => {
  for (let i = 0; i < 5; i += 1) {
    ship.hit();
  }
  expect(ship.isSunk()).toBeTruthy();
});
