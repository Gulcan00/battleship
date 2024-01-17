import Gameboard from './Gameboard';
import Player from './Player';

export default function Game(playerName = 'Player') {
  const player1Board = Gameboard();
  const player2Board = Gameboard();

  // Populate player 2 board
  player2Board.randomlyPlaceShips();

  const player1 = Player({ name: playerName, gameboard: player2Board });
  const player2 = Player({
    name: 'Computer',
    gameboard: player1Board,
    isComputer: true,
  });

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
