const {createNumberGame} = require('../../src/games/guess_number');

describe('GuessNumber', () => {
  it('reports GT for guess greater than target', () => {
    expect(createNumberGame(50).guess(60)).to.eql({
      comparedToAnswer: 'GT'
    });
  });

  it('reports LT for guess lower than target', () => {
    expect(createNumberGame(50).guess(10)).to.eql({
      comparedToAnswer: 'LT'
    });
  });

  it('reports EQ for guess equal to target', () => {
    expect(createNumberGame(50).guess(50)).to.eql({
      comparedToAnswer: 'EQ'
    });
  });
});
