const uuid = require('node-uuid');

const {generateWordGame} = require('./games/guess_word');
const {generateNumberGame} = require('./games/guess_number');

const handleNewConnection = (connection) => {

};

const handleConnectionClose = (connection) => {

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

const handleRequest = ({respond, message}) => {
  if (message.type === 'create_game') {
    createGame({respond, message});
  } else if (message.type === 'send_move') {
    applyMove({respond, message});
  } else {
    respond({error: 'unknown_message'});
  }
};

module.exports = {
  handleNewConnection: handleNewConnection,
  handleConnectionClose: handleConnectionClose,
  handleRequest: handleRequest
};
