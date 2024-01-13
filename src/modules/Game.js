import Gameboard from './Gameboard';
import Player from './Player';

export default function Game() {
  const player1Board = Gameboard();
  const player2Board = Gameboard();

  // Populate player 1 board
  player1Board.placeShip(0, 0, 'carrier');
  player1Board.placeShip(0, 1, 'battleship');
  player1Board.placeShip(4, 2, 'destroyer');
  player1Board.placeShip(6, 6, 'submarine');
  player1Board.placeShip(8, 9, 'patrolBoat');

  // Populate player 2 board
  player2Board.placeShip(0, 9, 'carrier');
  player2Board.placeShip(2, 0, 'battleship');
  player2Board.placeShip(0, 2, 'destroyer');
  player2Board.placeShip(3, 6, 'submarine');
  player2Board.placeShip(5, 9, 'patrolBoat');

  const player1 = Player({ name: 'John', player2Board });
  const player2 = Player({ name: 'Computer', player1Board, isComputer: true });

  function checkWinner() {
    if (player1Board.allIsSunk()) {
      return player2.name;
    }
    if (player2Board.allIsSunk()) {
      return player1.name;
    }
    return null;
  }

  return {
    player1,
    player2,
    player1Board,
    player2Board,
    checkWinner,
  };
}
