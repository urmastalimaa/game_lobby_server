const uuid = require('node-uuid');

const {generateWordGame} = require('./games/guess_word');
const {generateNumberGame} = require('./games/guess_number');

const onlinePlayers = {};

const handlePlayerJoin = (newPlayer) => {
  onlinePlayers[newPlayer.id] = newPlayer;
  notifyAllPlayers({except: newPlayer});

  console.log(`Player ${newPlayer.name} joined`);
};

const handlePlayerLeave = (player) => {
  delete onlinePlayers[player.id];
  notifyAllPlayers();

  console.log(`Player ${player.name} left`);
};

const notifyAllPlayers = ({except}={}) => {
  Object.keys(onlinePlayers).forEach((playerId) => {
    const player = onlinePlayers[playerId];
    if (player !== except) {
      player.notify({eventType: 'online-players', players: onlinePlayers});
    }
  });
};

const GAME_TYPE_TO_CREATE = {
  guess_word: generateWordGame,
  guess_number: generateNumberGame
};

const ongoingGames = {};

const createGame = ({respond, message}) => {
  if (message.game && GAME_TYPE_TO_CREATE[message.game.type]) {
    const gameId = uuid.v4();
    const game = GAME_TYPE_TO_CREATE[message.game.type](message.game.params);
    ongoingGames[gameId] = game;
    respond({id: gameId});
  } else {
    respond({error: 'invalid_game_parameters', type: message.game.type});
  }
};

const applyMove = ({respond, message}) => {
  const game = ongoingGames[message.gameId];
  if (game) {
    respond(game.guess(message.move));
  } else {
    respond({error: 'game_not_found'});
  }
};

const handleRequest = (player, {respond, message}) => {
  if (message.type === 'create_game') {
    createGame({respond, message});
  } else if (message.type === 'send_move') {
    applyMove({respond, message});
  } else {
    respond({error: 'unknown_message'});
  }
};

module.exports = {
  handlePlayerJoin: handlePlayerJoin,
  handlePlayerLeave: handlePlayerLeave,
  handleRequest: handleRequest
};
