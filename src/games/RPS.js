const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';

const POSSIBLE_MOVES = [ROCK, PAPER, SCISSORS];

const TIE = 'TIE';
const WIN = 'WIN';
const LOSS = 'LOSS';

const TYPE = 'rps';

class RPS {
  static generate({id}) {
    return new RPS({id});
  }

  constructor({id, generateOpposition}) {
    this.id = id;
    if (generateOpposition) {
      // Allow mocking out randomness.
      this.generateOpposition = generateOpposition;
    }
    this.status = 'waiting_for_move';
    this.type = TYPE;
    this.won = false;
  }

  generateOpposition() {
    return POSSIBLE_MOVES[Math.floor(Math.random() * POSSIBLE_MOVES.length)];
  }

  present() {
    const status = this.won ? 'finished' : 'waiting_for_move';
    return {id: this.id, type: this.type, status, won: this.won};
  }

  move({move}) {
    const opposition = this.generateOpposition();
    let moveResult;

    if (move === opposition) {
      moveResult = {result: TIE, guess: move, opposition: opposition};
    } else if (move === ROCK && opposition === SCISSORS) {
      this.won = true;
      moveResult = {result: WIN, guess: move, opposition: opposition};
    } else if (move === PAPER && opposition === ROCK) {
      this.won = true;
      moveResult = {result: WIN, guess: move, opposition: opposition};
    } else if (move === SCISSORS && opposition === PAPER) {
      this.won = true;
      moveResult = {result: WIN, guess: move, opposition: opposition};
    } else {
      moveResult = {result: LOSS, guess: move, opposition: opposition};
    }

    return Object.assign({}, this.present(), {move: moveResult});
  }
}

RPS.ROCK = ROCK;
RPS.PAPER = PAPER;
RPS.SCISSORS = SCISSORS;
RPS.TIE = TIE;
RPS.LOSS = LOSS;
RPS.WIN = WIN;

module.exports = RPS;
