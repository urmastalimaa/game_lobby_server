const words = [
  'paper',
  'grill',
  'basil',
  'hinge',
  'ruler'
];

const createWordGame = (targetWord) => {
  const guess = (guessWord) => {
    let nrOfCorrectLetters = 0;

    for(let i = 0; i < targetWord.length; i += 1) {
      if (guessWord.charAt(i) === targetWord.charAt(i)) {
        nrOfCorrectLetters += 1;
      }
    }
    const guessCorrect = guessWord === targetWord;

    return {
      move: {
        correct: guessCorrect,
        nrOfCorrectLetters: nrOfCorrectLetters,
        guess: guessWord,
      },
      game: {
        status: guessCorrect ? 'finished' : 'ready_for_move'
      }
    };
  };

  return {guess: guess};
};

const generateWordGame = () => {
  const word = words[Math.floor(Math.random() * words.length)];
  return createWordGame(word);
};

module.exports = {
  generateWordGame: generateWordGame,
  createWordGame: createWordGame
};
