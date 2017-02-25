const createWebsocketInterface = require('./WebsocketInterface');

const GameLobby = require('./GameLobby');
const Player = require('./Player');

let playerCounter = 0;

module.exports = ({delay}) => {
  const gameLobby = new GameLobby();

  return (request) => {
    playerCounter += 1;

    setTimeout(() => {
      const connection = request.accept('echo-protocol', request.origin);
      const queryParameters = request.resourceURL.query;

      const websocketInterface = createWebsocketInterface({delay})(connection);

      const player = new Player({
        connection: websocketInterface,
        name: queryParameters.playerName || `#${playerCounter}`
      });

      gameLobby.handlePlayerJoin(player);

      connection.on('message', (message) => {
        gameLobby.handleRequest(player, websocketInterface.buildRequest(message));
      });

      connection.on('close', (reasonCode, description) => {
        console.log(`Peer ${connection.remoteAddress} disconnected: ${reasonCode}, ${description}`);
        gameLobby.handlePlayerLeave(player);
      });
    }, delay);
  };
};
