const Hangman = require('../../src/games/Hangman');

describe('Hangman', () => {
  const id = 'game-id';
  const type = 'hangman';
  let game;

  const targetWord = 'barracuda';
  beforeEach(() => {
    game = new Hangman({id, targetWord});
  });

  it('starts with status waiting_for_move', () => {
    expect(game.present()).to.eql({
      id, type,
      status: 'waiting_for_move', won: false,
      wrongGuessCount: 0
    });
  });

  it('starts with all letters unknown', () => {
    expect(game.move({move: 'f'}).move).to.eql({
      guess: 'f',
      matchedLetterCount: 0,
      letters: [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ]
    });
  });

  it('increases wrong guess count when guessed incorrectly', () => {
    expect(game.move({move: 'f'}).wrongGuessCount).to.eq(1);
  });

  it('reveals guessed letters in letter status when guessed correctly', () => {
    const newGameState = game.move({move: 'a'});
    expect(newGameState.wrongGuessCount).to.eq(0);
    expect(newGameState.move.matchedLetterCount).to.eq(3);
    expect(newGameState.move.letters).to.eql([
      undefined,
      'a',
      undefined,
      undefined,
      'a',
      undefined,
      undefined,
      undefined,
      'a'
    ]);
  });

  it('ends game when guessed incorrectly 6 times', () => {
    game.move({move: 'e'});
    game.move({move: 'f'});
    game.move({move: 'g'});
    game.move({move: 'h'});
    const gameStateBeforeLosing = game.move({move: 'i'});
    expect(gameStateBeforeLosing.status).to.eql('waiting_for_move');
    const gameStateAfterLosing = game.move({move: 'j'});
    expect(gameStateAfterLosing.status).to.eql('finished');
    expect(gameStateAfterLosing.won).to.eql(false);
  });

  it('ends game when whole word guessed', () => {
    game.move({move: 'b'});
    game.move({move: 'a'});
    game.move({move: 'r'});
    game.move({move: 'c'});
    game.move({move: 'u'});
    const finalGameState = game.move({move: 'd'});
    expect(finalGameState.status).to.eql('finished');
    expect(finalGameState.won).to.eql(true);
  });
});
