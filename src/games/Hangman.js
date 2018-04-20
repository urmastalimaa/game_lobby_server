const TARGET_WORDS = ['barracuda', 'pufferfish', 'oyster', 'stingray'];
const LOSS_WRONG_GUESS_COUNT = 6;
const TYPE = 'hangman';

class Hangman {
  static generate({id}) {
    return new Hangman({
      id: id,
      targetWord: TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)]
    });
  }

  constructor({id, targetWord}) {
    this.id = id;
    this.won = false;
    this.lost = false;
    this.type = TYPE;
    this.wrongGuessCount = 0;
    this.targetWord = targetWord;
    this.letterStatuses = targetWord.split('').map(
      (c) => ({guessedLetter: undefined, target: c})
    );
  }

  present() {
    const status = (this.won || this.lost) ? 'finished' : 'waiting_for_move';
    return {
      id: this.id,
      type: this.type,
      status,
      won: this.won,
      wrongGuessCount: this.wrongGuessCount,
      letters: this.getGuessedLetters()
    };
  }

  getGuessedLetters() {
    return this.letterStatuses.map((s) => (s.guessedLetter));
  }

  move({move}) {
    const letter = move;
    const matchedLetterCount = (this.targetWord.match(new RegExp(letter, 'g')) || []).length;

    if (matchedLetterCount === 0) {
      this.wrongGuessCount = this.wrongGuessCount + 1;
      this.lost = (this.wrongGuessCount >= LOSS_WRONG_GUESS_COUNT);
    } else {
      this.letterStatuses = this.letterStatuses.map((status) => {
        if (status.target === letter) {
          return Object.assign({}, status, {guessedLetter: letter});
        } else {
          return status;
        }
      });
      if (this.letterStatuses.every((s) => s.guessedLetter !== undefined)) {
        this.won = true;
      }
    }
    return Object.assign({}, this.present(), {
      move: {guess: move, matchedLetterCount: matchedLetterCount}
    });
  }
}

module.exports = Hangman;
