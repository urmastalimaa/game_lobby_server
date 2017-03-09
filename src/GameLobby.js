const uuid = require('node-uuid');
const R = require('ramda');

const GuessWord = require('./games/GuessWord');
const GuessNumber = require('./games/GuessNumber');

const serializeList = R.map((element) => element.serialize());

const GAME_TYPE_TO_CREATE = {
  guess_word: GuessWord.generate,
  guess_number: GuessNumber.generate
};

class GameLobby {
  constructor() {
    this.onlinePlayers = {};
    this.ongoingGames = {};
  }

  findPlayers(playerIds) {
    return R.values(R.pick(playerIds)(this.onlinePlayers));
  }

  allPlayers() {
    return R.values(this.onlinePlayers);
  }

  playerWithNameExists(name) {
    return R.any(R.propEq('name', name), R.values(this.onlinePlayers));
  }

  notifyAllPlayers(message, {except}={}) {
    Object.keys(this.onlinePlayers).forEach((playerId) => {
      const player = this.onlinePlayers[playerId];
      if (player !== except) {
        player.notify(message);
      }
    });
  }

  handlePlayerJoin(newPlayer) {
    this.onlinePlayers[newPlayer.id] = newPlayer;
    this.notifyAllPlayers({
      eventType: 'online-players',
      players: serializeList(this.onlinePlayers)
    });

    console.log(`Player ${JSON.stringify(newPlayer.serialize())} joined`);
  }

  handlePlayerLeave(player) {
    delete this.onlinePlayers[player.id];
    this.notifyAllPlayers({
      eventType: 'online-players',
      players: serializeList(this.onlinePlayers)
    });

    console.log(`Player ${JSON.stringify(player.serialize())} left`);
  }

  createGame({player, respond, message}) {
    if (!message.game) {
      respond({error: 'missing_game_parameter'});
    } else if (!message.game.type || !GAME_TYPE_TO_CREATE[message.game.type]) {
      respond({error: 'unknown_game_type'});
    } else if (!message.game.mode) {
      respond({error: 'unknown_game_mode'});
    } else {
      const gameId = uuid.v4();
      const specifiedPlayers = message.game.players || [];

      const players = (specifiedPlayers.length > 0) ?
        this.findPlayers(specifiedPlayers.concat(player.id)) :
        this.allPlayers();

      const gameParams = R.merge(message.game, {id: gameId, players});
      const game = GAME_TYPE_TO_CREATE[message.game.type](gameParams);
      this.ongoingGames[gameId] = game;

      const otherPlayers = game.getPlayers()
        .filter((gamePlayer) => gamePlayer !== player);

      otherPlayers.forEach((otherPlayer) =>
          otherPlayer.notify({eventType: 'game_created', game: game.presentFor(otherPlayer)}));

      respond(game.presentFor(player));
    }
  }
  applyMove(player, {respond, message}) {
    const game = this.ongoingGames[message.gameId];
    if (!game) {
      respond({error: 'game_not_found'});
    } else {
      const response = game.move({player: player, move: message.move});
      if (!response.error) {
        const otherPlayers = game.getPlayers()
          .filter((gamePlayer) => gamePlayer !== player);
        otherPlayers.forEach((otherPlayer) =>
            otherPlayer.notify({eventType: 'game_move', game: game.presentFor(otherPlayer), move: response.move}));
      }
      respond(response);
    }
  }
  handleRequest(player, {respond, message}) {
    if (message.type === 'create_game') {
      this.createGame({player, respond, message});
    } else if (message.type === 'send_move') {
      this.applyMove(player, {respond, message});
    } else {
      respond({error: 'unknown_message'});
    }
  }
}


module.exports = GameLobby;
