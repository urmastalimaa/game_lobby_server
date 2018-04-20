const uuid = require('uuid');

const GuessWord = require('./games/GuessWord');
const GuessNumber = require('./games/GuessNumber');
const Hangman = require('./games/Hangman');
const RPS = require('./games/RPS');

const GAME_TYPE_TO_CREATE = {
  guess_word: GuessWord.generate,
  guess_number: GuessNumber.generate,
  hangman: Hangman.generate,
  rps: RPS.generate
};

class GameLobby {
  constructor() {
    this.ongoingGames = {};
  }

  createGame(params = {}, respond) {
    const type = params.type;

    if (!params.type || !GAME_TYPE_TO_CREATE[params.type]) {
      respond({body: {error: 'unknown_game_type'}, status: 422});
    } else {
      const gameParams = {
        id: uuid.v4(),
        type
      };

      const game = GAME_TYPE_TO_CREATE[gameParams.type](gameParams);
      this.ongoingGames[gameParams.id] = game;

      respond({body: game.present(), status: 201});
    }
  }

  applyMove(params, respond) {
    const game = this.ongoingGames[params.gameId];
    if (!game) {
      respond({error: 'game_not_found', status: 404});
    } else if (!params.guess) {
      respond({error: 'invalid_input', status: 422});
    } else {
      const response = game.move({move: params.guess});
      respond({body: response, status: 201});
    }
  }
}

module.exports = GameLobby;
