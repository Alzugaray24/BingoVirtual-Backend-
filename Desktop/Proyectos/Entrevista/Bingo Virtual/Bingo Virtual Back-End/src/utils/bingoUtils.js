export const generateBingoCard = () => {
  const card = [];
  const numbers = Array.from({ length: 75 }, (_, index) => index + 1);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  for (let row = 0; row < 5; row++) {
    card.push(numbers.splice(0, 5));
  }

  return card;
};

const checkRow = (card, markedBalls) =>
  card.some((row) => row.every((number) => markedBalls.includes(number)));

const checkColumn = (card, markedBalls) => {
  for (let col = 0; col < card[0].length; col++) {
    if (card.every((row) => markedBalls.includes(row[col]))) {
      return true;
    }
  }
  return false;
};

const checkDiagonal = (card, markedBalls) => {
  const mainDiagonal = card.map((row, index) => row[index]);
  const secondaryDiagonal = card.map(
    (row, index) => row[card.length - 1 - index]
  );

  return (
    mainDiagonal.every((number) => markedBalls.includes(number)) ||
    secondaryDiagonal.every((number) => markedBalls.includes(number))
  );
};

export const checkForWinningCondition = (card, markedBalls) =>
  checkRow(card, markedBalls) ||
  checkColumn(card, markedBalls) ||
  checkDiagonal(card, markedBalls);
