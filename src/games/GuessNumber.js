const TurnBasedOrRealTimeGame = require('./TurnBasedOrRealTimeGame');

class GuessNumber {
  static generate({id, players, mode}) {
    const upperBound = 100;
    const number = Math.floor(Math.random() * upperBound);
    return new GuessNumber({id, targetNumber: number, players, mode});
  }

  constructor({id, targetNumber, players, mode}) {
    this.game = new TurnBasedOrRealTimeGame({id, players, mode, type: 'guess_number'});
    this.targetNumber = targetNumber;
  }

  move({player, move}) {
    if (!this.game.isNextToMove(player)) {
      return {error: 'not_your_move', nextPlayer: this.game.getNextPlayer().serialize()};
    }
    const isCorrect = move === this.targetNumber;
    this.game.move({player, move, isCorrect});

    if (move === this.targetNumber) {
      return {move: {comparedToAnswer: 'EQ', guess: move}, game: this.game.presentFor(player)};
    } else if (move > this.targetNumber) {
      return {move: {comparedToAnswer: 'GT', guess: move}, game: this.game.presentFor(player)};
    } else {
      return {move: {comparedToAnswer: 'LT', guess: move}, game: this.game.presentFor(player)};
    }
  }

  presentFor(player) {
    return this.game.presentFor(player);
  }

  getPlayers() {
    return this.game.getPlayers();
  }
}

module.exports = GuessNumber;
