const createNumberGame = (targetNumber) => {
  const guess = (guessNumber) => {
    if (guessNumber == targetNumber) {
      return {move: {comparedToAnswer: 'EQ', guess: guessNumber}, game: {status: 'finished'}};
    } else if (guessNumber > targetNumber) {
      return {move: {comparedToAnswer: 'GT', guess: guessNumber}, game: {status: 'ready_for_move'}};
    } else {
      return {move: {comparedToAnswer: 'LT', guess: guessNumber}, game: {status: 'ready_for_move'}};
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
