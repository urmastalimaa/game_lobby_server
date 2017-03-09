const createWebsocketInterface = require('./WebsocketInterface');

const GameLobby = require('./GameLobby');
const Player = require('./Player');
const uuid = require('node-uuid');
const R = require('ramda');

const CONNECTION_REJECT_REASONS = {
  nameTaken: 'player-name-taken'
};

module.exports = ({delay}) => {
  const gameLobby = new GameLobby();

  return (httpRequest) => {
    setTimeout(() => {
      const queryParameters = httpRequest.resourceURL.query;
      const playerName = queryParameters.playerName;

      const playerIdCookieName = `${playerName}.player-id`;
      const playerIdCookie = R.find(R.propEq('name', playerIdCookieName), httpRequest.cookies);
      const playerId = playerIdCookie ? playerIdCookie.value : uuid.v4();

      const cookies = [{name: playerIdCookieName, value: playerId, maxage: 0, httponly: true}];
      const connection = httpRequest.accept('echo-protocol', httpRequest.origin, cookies);

      const websocketInterface = createWebsocketInterface({delay})(connection);

      const player = new Player({
        id: playerId,
        connection: websocketInterface,
        name: playerName
      });

      player.notify({
        eventType: 'connection:accepted',
        playerId: player.id
      });

      if (gameLobby.playerWithNameExists(playerName)) {
        connection.close(4000, CONNECTION_REJECT_REASONS.nameTaken);
      } else {
        gameLobby.handlePlayerJoin(player);

        connection.on('message', (message) => {
          let request;
          try {
            request = websocketInterface.buildRequest(message);
          } catch (e) {
            console.error(e, message.utf8Data);
            return;
          }

          gameLobby.handleRequest(player, request);
        });

        connection.on('close', (reasonCode, description) => {
          console.log(`Peer ${connection.remoteAddress} disconnected: ${reasonCode}, ${description}`);
          gameLobby.handlePlayerLeave(player);
        });
      }
    }, delay);
  };
};
