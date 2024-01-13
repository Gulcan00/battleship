import Gameboard from './Gameboard';
import Player from './Player';

export default function GameController() {
  const player1Board = Gameboard();
  const player2Board = Gameboard();

  const player1 = Player({ name: 'John', player2Board });
  const player2 = Player({ name: 'Computer', player1Board, isComputer: true });
}
