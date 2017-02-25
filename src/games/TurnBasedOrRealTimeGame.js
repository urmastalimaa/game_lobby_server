const R = require('ramda');

const ANY_PLAYER = 'any-player';
const GAME_MODES = {
  turnBased: 'turnBased',
  realTime: 'realTime'
};

class TurnBasedOrRealTimeGame {
  constructor({id, type, players, mode}) {
    this.id = id;
    this.type = type;
    this.moves = [];
    this.players = players;
    this.mode = mode;
    this.winner = null;
    if (this.mode === GAME_MODES.turnBased) {
      this.nextPlayer = players[0];
    } else {
      this.nextPlayer = ANY_PLAYER;
    }
  }

  isNextToMove(player) {
    return this.mode === GAME_MODES.realTime || this.nextPlayer === player;
  }

  getNextPlayer() {
    return this.nextPlayer;
  }

  getPlayers() {
    return this.players;
  }

  move({player, move, isCorrect}) {
    this.moves.push({player, move});
    this.nextPlayer = this.players[(this.players.indexOf(this.nextPlayer) + 1) % this.players.length];
    if (isCorrect) {
      this.winner = player;
    }
  }

  presentFor(player) {
    const generalState = {id: this.id, type: this.type, players: this.players.map((player) => player.id)};

    if (this.winner) {
      return R.merge(generalState, {status: 'finished', winner: this.winner.serialize()});
    } else if (this.mode === GAME_MODES.realTime || this.nextPlayer === player) {
      return R.merge(generalState, {status: 'waiting_for_move'});
    } else {
      return R.merge(generalState, {status: 'waiting_for_opponent', nextPlayer: this.nextPlayer.serialize()});
    }
  }
}

module.exports = TurnBasedOrRealTimeGame;
