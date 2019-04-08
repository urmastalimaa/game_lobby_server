const Metronome = require('../../src/games/Metronome');

describe('Metronome', () => {
  const id = 'game-id';
  const type = 'metronome';

  it('starts with status waiting_for_move', () => {
    const startTimeMillis = Date.now();
    const frequency = 1000;

    expect(new Metronome({id, frequency, startTimeMillis}).present()).to.eql({
      id,
      type,
      status: 'waiting_for_move',
      startTimeMillis: startTimeMillis,
      frequency: frequency,
      tries: []
    });
  });

  it('records new try', () => {
    const startTimeMillis = Date.now();
    const frequency = 1000;
    const game = new Metronome({id, frequency, startTimeMillis});
    game.recordTry();
    expect(game.present().tries.length).to.eq(1);
    expect(game.present().tries[0].miss).to.be.a('number');
  });
});
