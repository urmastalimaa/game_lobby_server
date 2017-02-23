const uuid = require('node-uuid');

const {generateWordGame} = require('./games/guess_word');
const {generateNumberGame} = require('./games/guess_number');

const onlinePlayers = {};

const handlePlayerJoin = (newPlayer) => {
  onlinePlayers[newPlayer.id] = newPlayer;
  notifyAllPlayers({
    eventType: 'online-players',
    players: onlinePlayers
  });

  console.log(`Player ${newPlayer.name} joined`);
};

const handlePlayerLeave = (player) => {
  delete onlinePlayers[player.id];
  notifyAllPlayers({
    eventType: 'online-players',
    players: onlinePlayers
  });

  console.log(`Player ${player.name} left`);
};

const notifyAllPlayers = (message, {except}={}) => {
  Object.keys(onlinePlayers).forEach((playerId) => {
    const player = onlinePlayers[playerId];
    if (player !== except) {
      player.notify(message);
    }
  });
};

const GAME_TYPE_TO_CREATE = {
  guess_word: generateWordGame,
  guess_number: generateNumberGame
};

const ongoingGames = {};

const createGame = ({player, respond, message}) => {
  if (message.game && GAME_TYPE_TO_CREATE[message.game.type]) {
    const gameId = uuid.v4();
    const game = GAME_TYPE_TO_CREATE[message.game.type](message.game.params);
    ongoingGames[gameId] = game;
    respond({id: gameId});
    notifyAllPlayers({eventType: 'game_created', game: {type: message.game.type, id: gameId}}, {except: player});
  } else {
    respond({error: 'invalid_game_parameters', type: message.game.type});
  }
};

const applyMove = (player, {respond, message}) => {
  const game = ongoingGames[message.gameId];
  if (game) {
    const guess = game.guess(message.move);
    respond(guess);
    notifyAllPlayers({
      eventType: 'game_move',
      move: guess.move,
      game: guess.game,
      gameId: message.gameId
    }, {except: player});
  } else {
    respond({error: 'game_not_found'});
  }
};

const handleRequest = (player, {respond, message}) => {
  if (message.type === 'create_game') {
    createGame({player, respond, message});
  } else if (message.type === 'send_move') {
    applyMove(player, {respond, message});
  } else {
    respond({error: 'unknown_message'});
  }
};

module.exports = {
  handlePlayerJoin: handlePlayerJoin,
  handlePlayerLeave: handlePlayerLeave,
  handleRequest: handleRequest
};
