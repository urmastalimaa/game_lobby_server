const {createWordGame} = require('../../src/games/guess_word');

describe('GuessWord', () => {
  it('reports not correct for substring guess', () => {
    expect(
      createWordGame('paper').guess('pape')
    ).to.eql({
      nrOfCorrectLetters: 4,
      correct: false
    });
  });

  it('reports incorrect for superstring guess', () => {
    expect(
      createWordGame('paper').guess('paperboy')
    ).to.eql({
      nrOfCorrectLetters: 5,
      correct: false
    });
  });

  it('reports nrOfCorrectLetters for incorrect guess ', () => {
    expect(
      createWordGame('paper').guess('vinyl')
    ).to.eql({
      nrOfCorrectLetters: 0,
      correct: false
    });
  });

  it('reports correct for correct guess', () => {
    expect(
      createWordGame('paper').guess('paper')
    ).to.eql({
      nrOfCorrectLetters: 5,
      correct: true
    });
  });
});
