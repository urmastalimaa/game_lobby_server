const createNumberGame = (targetNumber) => {
  const guess = (guessNumber) => {
    if (guessNumber == targetNumber) {
      return {comparedToAnswer: 'EQ'};
    } else if (guessNumber > targetNumber) {
      return {comparedToAnswer: 'GT'};
    } else {
      return {comparedToAnswer: 'LT'};
    }
  };

  return {guess: guess};
};

const generateNumberGame = () => {
  const upperBound = 100;
  const number = Math.floor(Math.random() * upperBound);
  return createNumberGame(number);
};

module.exports = {
  generateNumberGame: generateNumberGame,
  createNumberGame: createNumberGame
};
