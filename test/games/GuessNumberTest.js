const GuessNumber = require('../../src/games/GuessNumber');

describe('GuessNumber', () => {
  const id = 'game-id';

  let game;
  beforeEach(() => {
    game = new GuessNumber({id, targetNumber: 50});
  });

  it('waits for next move and reports GT for guess greater than target', () => {
    expect(game.move({move: 60})).to.eql({
      move: {comparedToAnswer: 'GT', guess: 60},
      game: {id, type: 'guess_number', status: 'waiting_for_move'}
    });
  });

  it('waits for next move and reports LT for guess lower than target', () => {
    expect(game.move({move: 10})).to.eql({
      move: {comparedToAnswer: 'LT', guess: 10},
      game: {id, type: 'guess_number', status: 'waiting_for_move'}
    });
  });

  it('finishes game and reports EQ for guess equal to target', () => {
    expect(game.move({move: 50})).to.eql({
      move: {comparedToAnswer: 'EQ', guess: 50},
      game: {id, type: 'guess_number', status: 'finished'}
    });
  });
});
