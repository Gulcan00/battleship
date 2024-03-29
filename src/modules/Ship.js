export default function Ship(length) {
  let hitCount = 0;

  function hit() {
    hitCount += 1;
  }

  function isSunk() {
    return hitCount >= length;
  }

  return {
    length,
    hit,
    isSunk,
  };
}
