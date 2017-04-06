class Game {
  constructor({id, type}) {
    this.id = id;
    this.type = type;
    this.finished = false;
    this.moves = [];
  }

  move({move, isCorrect}) {
    this.moves.push({move});
    if (isCorrect) {
      this.finished = true;
    }
  }

  present() {
    const status = this.finished ? 'finished' : 'waiting_for_move';
    return {id: this.id, type: this.type, status};
  }
}

module.exports = Game;
