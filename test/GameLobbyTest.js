const GameLobby = require('../src/GameLobby');

const generatePlayer = (id) =>
  ({
    id: id,
    name: id + '-name',
    notify: sinon.stub(),
    serialize: () => ({id, name: id + '-name'})
  });

describe('GameLobby', () => {
  let gameLobby;
  beforeEach(() => {
    gameLobby = new GameLobby();
  });

  it('notifies players when others join', () => {
    let player1 = generatePlayer('player1');
    let player2 = generatePlayer('player2');

    gameLobby.handlePlayerJoin(player1);
    gameLobby.handlePlayerJoin(player2);

    expect(player1.notify).to.have.been.calledWith({
      eventType: 'online-players',
      players: {
        [player1.id]: player1.serialize(),
        [player2.id]: player2.serialize()
      }
    });

    expect(player2.notify).to.have.been.calledWith({
      eventType: 'online-players',
      players: {
        [player1.id]: player1.serialize(),
        [player2.id]: player2.serialize()
      }
    });
  });

  it('notifies players when others leave', () => {
    let player1 = generatePlayer('player1');
    let player2 = generatePlayer('player2');

    gameLobby.handlePlayerJoin(player1);
    gameLobby.handlePlayerJoin(player2);
    gameLobby.handlePlayerLeave(player1);

    expect(player2.notify).to.have.been.calledWith({
      eventType: 'online-players',
      players: {
        [player2.id]: player2.serialize()
      }
    });
  });

  context('with one player', () => {
    let player;
    beforeEach(() => {
      player = generatePlayer('player1');
      gameLobby.handlePlayerJoin(player);
    });

    it('sets up word game', () => {
      const createGameRespond = sinon.stub();
      gameLobby.handleRequest(player, {
        message: {type: 'create_game', game: {mode: 'realTime', type: 'guess_word'}},
        respond: createGameRespond
      });
      expect(createGameRespond).to.have.been.called;
      const createdGame = createGameRespond.getCall(0).args[0];

      const sendMoveRespond = sinon.stub();

      gameLobby.handleRequest(player, {
        message: {type: 'send_move', gameId: createdGame.id, move: 'wrong-word'},
        respond: sendMoveRespond
      });
      expect(sendMoveRespond).to.have.been.calledWith({
        game: createdGame,
        move: {correct: false, nrOfCorrectLetters: 0, guess: 'wrong-word'}
      });
    });
  });

  context('with multiple players', () => {
    let player1;
    let player2;
    let player3;

    beforeEach(() => {
      player1 = generatePlayer('player1');
      player2 = generatePlayer('player2');
      player3 = generatePlayer('player3');
      gameLobby.handlePlayerJoin(player1);
      gameLobby.handlePlayerJoin(player2);
      gameLobby.handlePlayerJoin(player3);
    });

    it('sets up word game with no specified players', () => {
      const createGameRespond = sinon.stub();
      gameLobby.handleRequest(player1, {
        message: {type: 'create_game', game: {mode: 'realTime', type: 'guess_word'}},
        respond: createGameRespond
      });
      expect(createGameRespond).to.have.been.called;
      const createdGame = createGameRespond.getCall(0).args[0];

      const sendMoveRespond = sinon.stub();

      gameLobby.handleRequest(player1, {
        message: {type: 'send_move', gameId: createdGame.id, move: 'wrong-word'},
        respond: sendMoveRespond
      });
      expect(sendMoveRespond).to.have.been.calledWith({
        game: createdGame,
        move: {correct: false, nrOfCorrectLetters: 0, guess: 'wrong-word'}
      });

      expect(player2.notify).to.have.been.calledWith({
        eventType: 'game_created',
        game: createdGame
      });

      expect(player3.notify).to.have.been.calledWith({
        eventType: 'game_created',
        game: createdGame
      });
    });

    it('sets up word game with specified players', () => {
      const createGameRespond = sinon.stub();
      gameLobby.handleRequest(player1, {
        message: {
          type: 'create_game',
          game: {
            mode: 'realTime',
            type: 'guess_word',
            players: [player2.id]
          }
        },
        respond: createGameRespond
      });
      expect(createGameRespond).to.have.been.called;
      const createdGame = createGameRespond.getCall(0).args[0];

      const sendMoveRespond = sinon.stub();

      gameLobby.handleRequest(player1, {
        message: {type: 'send_move', gameId: createdGame.id, move: 'wrong-word'},
        respond: sendMoveRespond
      });
      expect(sendMoveRespond).to.have.been.calledWith({
        game: createdGame,
        move: {correct: false, nrOfCorrectLetters: 0, guess: 'wrong-word'}
      });

      expect(player2.notify).to.have.been.calledWith({
        eventType: 'game_created',
        game: createdGame
      });

      expect(player3.notify).not.to.have.been.calledWith({
        eventType: 'game_created',
        game: createdGame
      });
    });
  });

  describe('playerWithNameExists', () => {
    it('is true if player with name exists', () => {
      let player1 = generatePlayer('player1');
      gameLobby.handlePlayerJoin(player1);
      expect(gameLobby.playerWithNameExists(player1.name)).to.eq(true);
    });

    it('is true if player with name does not exist', () => {
      expect(gameLobby.playerWithNameExists('player2')).to.eq(false);
    });
  });
});
