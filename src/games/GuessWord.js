const Game = require('./Game');

const words = [
  'paper',
  'grill',
  'basil',
  'hinge',
  'ruler'
];

class GuessWord {
  static generate({id}) {
    const word = words[Math.floor(Math.random() * words.length)];
    return new GuessWord({id, targetWord: word});
  }

  constructor({id, targetWord}) {
    this.game = new Game({id, type: 'guess_word'});
    this.targetWord = targetWord;
  }

  move({move}) {
    const isCorrect = move === this.targetWord;
    this.game.move({move, isCorrect});

    const letterMatches = [];
    const guessWord = move;
    for(let i = 0; i < guessWord.length; i += 1) {
      const guessLetter = guessWord.charAt(i);
      const correct = guessLetter === this.targetWord.charAt(i);
      letterMatches.push(correct);
    }

    if (isCorrect) {
      return {move: {correct: true, letterMatches, guess: guessWord}, game: this.game.present()};
    } else {
      return {move: {correct: false, letterMatches, guess: guessWord}, game: this.game.present()};
    }
  }

  present() {
    return this.game.present();
  }
}

module.exports = GuessWord;
