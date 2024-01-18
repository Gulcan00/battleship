export default function Player({ name, gameboard, isComputer = false }) {
  let hitRow;
  let hitCol;

  function adjacentMoves() {
    const moves = [];
    if (hitRow + 1 < 10) {
      moves.push([hitRow + 1, hitCol]);
    }
    if (hitRow - 1 >= 0) {
      moves.push([hitRow - 1, hitCol]);
    }
    if (hitCol + 1 < 10) {
      moves.push([hitRow, hitCol + 1]);
    }
    if (hitCol - 1 >= 0) {
      moves.push([hitRow, hitCol - 1]);
    }
    return moves;
  }

  function getMove() {
    if (hitRow && hitCol) {
      const moves = adjacentMoves();
      const allMovesMade = moves.every(
        (move) =>
          gameboard.getBoard()[move[0]][move[1]] === 'hit' ||
          gameboard.getBoard()[move[0]][move[1]] === 'miss'
      );

      if (allMovesMade) {
        hitRow = null;
        hitCol = null;
        return getMove();
      }

      let randInx = Math.floor(Math.random() * moves.length);
      while (
        gameboard.getBoard()[moves[randInx][0]][moves[randInx][1]] === 'hit' ||
        gameboard.getBoard()[moves[randInx][0]][moves[randInx][1]] === 'miss'
      ) {
        randInx = Math.floor(Math.random() * moves.length);
      }
      return moves[randInx];
    }
    let randRow = Math.floor(Math.random() * 10);
    let randCol = Math.floor(Math.random() * 10);
    while (
      gameboard.getBoard()[randRow][randCol] === 'miss' ||
      gameboard.getBoard()[randRow][randCol] === 'hit'
    ) {
      randRow = Math.floor(Math.random() * 10);
      randCol = Math.floor(Math.random() * 10);
    }

    return [randRow, randCol];
  }

  function attack(row, col) {
    if (!isComputer) {
      gameboard.receiveAttack(row, col);
      return [row, col];
    }

    const [computerRow, computerCol] = getMove();
    gameboard.receiveAttack(computerRow, computerCol);
    if (gameboard.getBoard()[computerRow][computerCol] === 'hit') {
      hitRow = computerRow;
      hitCol = computerCol;
    }

    return [computerRow, computerCol];
  }
  return {
    name,
    attack,
  };
}
