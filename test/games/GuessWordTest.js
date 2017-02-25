const GuessWord = require('../../src/games/GuessWord');

describe('GuessWord', () => {
  const id = 'game-id';

  context('realTime', () => {
    const player = {id: 'player-id', name: 'player', serialize: () => player};
    let game;
    beforeEach(() => {
      game = new GuessWord({id, targetWord: 'paper', players: [player], mode: 'realTime'});
    });

    it('reports not correct for substring guess', () => {
      expect(game.move({player: player, move: 'pape'})).to.eql({
        move: {nrOfCorrectLetters: 4, correct: false, guess: 'pape'},
        game: {id, status: 'waiting_for_move'}
      });
    });

    it('reports incorrect for superstring guess', () => {
      expect(game.move({player: player, move: 'paperboy'})).to.eql({
        move: {nrOfCorrectLetters: 5, correct: false, guess: 'paperboy'},
        game: {id, status: 'waiting_for_move'}
      });
    });

    it('reports nrOfCorrectLetters for incorrect guess ', () => {
      expect(game.move({player: player, move: 'vinyl'})).to.eql({
        move: {nrOfCorrectLetters: 0, correct: false, guess: 'vinyl'},
        game: {id, status: 'waiting_for_move'}
      });
    });

    it('reports correct for correct guess', () => {
      expect(game.move({player: player, move: 'paper'})).to.eql({
        move: {nrOfCorrectLetters: 5, correct: true, guess: 'paper'},
        game: {id, status: 'finished', winner: player}
      });
    });
  });
  context('turnBased', () => {
    const player1 = {id: 'player-1-id', name: 'player-1', serialize: () => player1};
    const player2 = {id: 'player-1-id', name: 'player-1', serialize: () => player2};
    const players = [player1, player2];
    let game;

    beforeEach(() => {
      game = new GuessWord({id, targetWord: 'paper', players: players, mode: 'turnBased'});
    });

    it('allows first player to guess and gives move to next player', () => {
      expect(game.move({player: player1, move: 'pape'})).to.eql({
        move: {nrOfCorrectLetters: 4, correct: false, guess: 'pape'},
        game: {id, status: 'waiting_for_opponent', nextPlayer: player2}
      });
    });

    it('disallows second player guess', () => {
      expect(game.move({player: player2, move: 'pape'})).to.eql({
        error: 'not_your_move',
        nextPlayer: player1
      });
    });
  });
});
