export default function Player({ name, gameboard, isComputer = false }) {
  function getMove() {
    let randRow = Math.floor(Math.random() * 10);
    let randCol = Math.floor(Math.random() * 10);
    while (
      gameboard.getBoard()[randRow][randCol] === 'hit' ||
      gameboard.getBoard()[randRow][randCol] === 'miss'
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
    return [computerRow, computerCol];
  }
  return {
    name,
    attack,
  };
}
