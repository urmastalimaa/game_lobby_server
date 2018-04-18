const GameLobby = require('../src/GameLobby');

describe('GameLobby', () => {
  let gameLobby;
  beforeEach(() => {
    gameLobby = new GameLobby();
  });

  it('responds with 404 when game not found for move', () => {
    const sendMoveRespond = sinon.stub();
    gameLobby.applyMove(
      {gameId: 'non-existing-id', move: 'wrong'},
      sendMoveRespond
    );
    expect(sendMoveRespond).to.have.been.calledWith({
      error: 'game_not_found',
      status: 404
    });
  });

  it('responds with 422 when invalid input sent', () => {
    const createGameRespond = sinon.stub();
    gameLobby.createGame(
      {type: 'guess_word'},
      createGameRespond
    );
    const createdGame = createGameRespond.getCall(0).args[0].body;

    const sendMoveRespond = sinon.stub();
    gameLobby.applyMove(
      {gameId: createdGame.id, invalidField: 'anything'},
      sendMoveRespond
    );
    expect(sendMoveRespond).to.have.been.calledWith({
      error: 'invalid_input',
      status: 422
    });
  });

  it('sets up word game', () => {
    const createGameRespond = sinon.stub();
    gameLobby.createGame(
      {type: 'guess_word'},
      createGameRespond
    );
    expect(createGameRespond).to.have.been.called;
    const createdGame = createGameRespond.getCall(0).args[0].body;

    const sendMoveRespond = sinon.stub();

    gameLobby.applyMove(
      {gameId: createdGame.id, guess: 'wrong'},
      sendMoveRespond
    );

    expect(sendMoveRespond).to.have.been.calledWith({
      body: {
        game: createdGame,
        move: {
          correct: false,
          letterMatches: [false, false, false, false, false],
          guess: 'wrong'
        }
      }, status: 201
    });
  });
});
