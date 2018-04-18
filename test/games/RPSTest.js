const RPS = require('../../src/games/RPS');
const {ROCK, PAPER, SCISSORS, TIE, WIN, LOSS} = RPS;

describe('RPS', () => {
  const id = 'game-id';
  const type = 'rps';

  it('starts with status waiting_for_move', () => {
    expect(new RPS({id}).present()).to.eql({
      id, type,
      status: 'waiting_for_move', won: false
    });
  });

  it('reports tie when opposition and guess are same', () => {
    [ROCK, PAPER, SCISSORS].forEach((guess) => {
      const generateOpposition = () => guess;
      expect(new RPS({id, generateOpposition}).move({move: guess}).move).to.eql({
        result: TIE, guess: guess, opposition: guess
      });
    });
  });

  it('reports WIN when ROCK guessed versus SCISSORS', () => {
    const generateOpposition = () => SCISSORS;
    const game = new RPS({id, generateOpposition});
    expect(game.move({move: ROCK})).to.eql({
      id, type,
      status: 'finished', won: true,
      move: {result: WIN, guess: ROCK, opposition: SCISSORS}
    });
  });

  it('reports WIN when SCISSORS guessed versus PAPER', () => {
    const generateOpposition = () => PAPER;
    const game = new RPS({id, generateOpposition});
    expect(game.move({move: SCISSORS})).to.eql({
      id, type,
      status: 'finished', won: true,
      move: {result: WIN, guess: SCISSORS, opposition: PAPER}
    });
  });

  it('reports WIN when PAPER guessed versus ROCK', () => {
    const generateOpposition = () => ROCK;
    const game = new RPS({id, generateOpposition});
    expect(game.move({move: PAPER})).to.eql({
      id, type,
      status: 'finished', won: true,
      move: {result: WIN, guess: PAPER, opposition: ROCK}
    });
  });

  it('reports LOSS when PAPER guessed versus SCISSORS', () => {
    const generateOpposition = () => SCISSORS;
    const game = new RPS({id, generateOpposition});
    expect(game.move({move: PAPER})).to.eql({
      id, type,
      status: 'waiting_for_move', won: false,
      move: {result: LOSS, guess: PAPER, opposition: SCISSORS}
    });
  });

  it('reports LOSS when SCISSORS guessed versus ROCK', () => {
    const generateOpposition = () => ROCK;
    const game = new RPS({id, generateOpposition});
    expect(game.move({move: SCISSORS})).to.eql({
      id, type,
      status: 'waiting_for_move', won: false,
      move: {result: LOSS, guess: SCISSORS, opposition: ROCK}
    });
  });

  it('reports LOSS when ROCK guessed versus PAPER', () => {
    const generateOpposition = () => PAPER;
    const game = new RPS({id, generateOpposition});
    expect(game.move({move: ROCK})).to.eql({
      id, type,
      status: 'waiting_for_move', won: false,
      move: {result: LOSS, guess: ROCK, opposition: PAPER}
    });
  });
});
