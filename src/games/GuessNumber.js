const Game = require('./Game');

class GuessNumber {
  static generate({id}) {
    const upperBound = 10;
    const number = Math.floor(Math.random() * upperBound);
    return new GuessNumber({id, targetNumber: number});
  }

  constructor({id, targetNumber}) {
    this.game = new Game({id, type: 'guess_number'});
    this.targetNumber = targetNumber;
  }

  move({move}) {
    const isCorrect = move === this.targetNumber;
    this.game.move({move, isCorrect});

    if (move === this.targetNumber) {
      return {move: {comparedToAnswer: 'EQ', guess: move}, game: this.game.present()};
    } else if (move > this.targetNumber) {
      return {move: {comparedToAnswer: 'GT', guess: move}, game: this.game.present()};
    } else {
      return {move: {comparedToAnswer: 'LT', guess: move}, game: this.game.present()};
    }
  }

  present() {
    return this.game.present();
  }
}

module.exports = GuessNumber;
