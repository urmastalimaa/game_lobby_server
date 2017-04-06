const GuessWord = require('../../src/games/GuessWord');

describe('GuessWord', () => {
  const id = 'game-id';
  let game;
  beforeEach(() => {
    game = new GuessWord({id, targetWord: 'paper'});
  });

  it('reports not correct for substring guess', () => {
    expect(game.move({move: 'pape'})).to.eql({
      move: {letterMatches: [true, true, true, true], correct: false, guess: 'pape'},
      game: {id, type: 'guess_word', status: 'waiting_for_move'}
    });
  });

  it('reports incorrect for superstring guess', () => {
    expect(game.move({move: 'paperboy'})).to.eql({
      move: {letterMatches: [true, true, true, true, true, false, false, false], correct: false, guess: 'paperboy'},
      game: {id, type: 'guess_word', status: 'waiting_for_move'}
    });
  });

  it('reports letterMatches for incorrect guess ', () => {
    expect(game.move({move: 'vinyl'})).to.eql({
      move: {letterMatches: [false, false, false, false, false], correct: false, guess: 'vinyl'},
      game: {id, type: 'guess_word', status: 'waiting_for_move'}
    });
  });

  it('reports correct for correct guess', () => {
    expect(game.move({move: 'paper'})).to.eql({
      move: {letterMatches: [true, true, true, true, true], correct: true, guess: 'paper'},
      game: {id, type: 'guess_word', status: 'finished'}
    });
  });
});
