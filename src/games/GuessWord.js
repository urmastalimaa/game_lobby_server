const TurnBasedOrRealTimeGame = require('./TurnBasedOrRealTimeGame');

const words = [
  'paper',
  'grill',
  'basil',
  'hinge',
  'ruler'
];

class GuessWord {
  static generate({id, players, mode}) {
    const word = words[Math.floor(Math.random() * words.length)];
    return new GuessWord({id, targetWord: word, players, mode});
  }

  constructor({id, targetWord, players, mode}) {
    this.game = new TurnBasedOrRealTimeGame({id, players, mode, type: 'guess_word'});
    this.targetWord = targetWord;
  }

  move({player, move}) {
    if (!this.game.isNextToMove(player)) {
      return {error: 'not_your_move', nextPlayer: this.game.getNextPlayer().serialize()};
    }
    const isCorrect = move === this.targetWord;
    this.game.move({player, move, isCorrect});

    let nrOfCorrectLetters = 0;
    const targetWord = this.targetWord;
    const guessWord = move;

    for(let i = 0; i < targetWord.length; i += 1) {
      if (guessWord.charAt(i) === targetWord.charAt(i)) {
        nrOfCorrectLetters += 1;
      }
    }
    if (guessWord === targetWord) {
      return {move: {correct: true, nrOfCorrectLetters, guess: guessWord}, game: this.game.presentFor(player)};
    } else {
      return {move: {correct: false, nrOfCorrectLetters, guess: guessWord}, game: this.game.presentFor(player)};
    }
  }

  presentFor(player) {
    return this.game.presentFor(player);
  }

  getPlayers() {
    return this.game.getPlayers();
  }
}

module.exports = GuessWord;
