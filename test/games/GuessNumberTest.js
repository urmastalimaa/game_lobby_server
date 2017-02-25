const GuessNumber = require('../../src/games/GuessNumber');

describe('GuessNumber', () => {
  const id = 'game-id';

  context('realTime', () => {
    const player = {id: 'player-id', name: 'player', serialize: () => player};
    let game;
    beforeEach(() => {
      game = new GuessNumber({id, targetNumber: 50, players: [player], mode: 'realTime'});
    });

    it('waits for next move and reports GT for guess greater than target', () => {
      expect(game.move({player, move: 60})).to.eql({
        move: {comparedToAnswer: 'GT', guess: 60},
        game: {id, status: 'waiting_for_move'}
      });
    });

    it('waits for next move and reports LT for guess lower than target', () => {
      expect(game.move({player, move: 10})).to.eql({
        move: {comparedToAnswer: 'LT', guess: 10},
        game: {id, status: 'waiting_for_move'}
      });
    });

    it('finishes game and reports EQ for guess equal to target', () => {
      expect(game.move({player, move: 50})).to.eql({
        move: {comparedToAnswer: 'EQ', guess: 50},
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
      game = new GuessNumber({id, targetNumber: 50, players: players, mode: 'turnBased'});
    });

    it('allows first player to guess and gives move to next player', () => {
      expect(game.move({player: player1, move: 10})).to.eql({
        move: {comparedToAnswer: 'LT', guess: 10},
        game: {id, status: 'waiting_for_opponent', nextPlayer: player2}
      });
    });

    it('disallows second player guess', () => {
      expect(game.move({player: player2, move: 10})).to.eql({
        error: 'not_your_move',
        nextPlayer: player1
      });
    });
  });
});
