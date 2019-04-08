const TYPE = 'metronome';

class Metronome {

  static generate(params) {
    if (!(parseInt(params.frequency) > 0)) {
      throw new Error('Invalid frequency');
    }

    return new Metronome({
      id: params.id,
      frequency: parseInt(params.frequency),
      startTimeMillis: Date.now()
    });
  }

  constructor({id, startTimeMillis, frequency}) {
    this.type = TYPE;
    this.id = id;
    this.startTimeMillis = startTimeMillis;
    this.frequency = frequency;
    this.tries = [];
    this.status = 'waiting_for_move';
  }

  move() {
    this.recordTry();
    return this.present();
  }

  calculateMiss(nowMilliseconds) {
    const remainder = (nowMilliseconds - this.startTimeMillis) % this.frequency;
    if (remainder >= this.frequency / 2) {
      return this.frequency - remainder;
    } else {
      return remainder;
    }
  }

  recordTry() {
    this.tries = this.tries.concat([{
      miss: this.calculateMiss(Date.now())
    }]);
  }

  present() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      startTimeMillis: this.startTimeMillis,
      frequency: this.frequency,
      tries: this.tries
    };
  }
}

module.exports = Metronome;
