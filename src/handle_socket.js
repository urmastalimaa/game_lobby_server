const createWebsocketInterface = require('./websocket_interface');

const {
  handlePlayerJoin,
  handlePlayerLeave,
  handleRequest
} = require('./game_lobby');

const Player = require('./player');

let playerCounter = 0;

module.exports = ({delay}) => {
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

      handlePlayerJoin(player);

      connection.on('message', (message) => {
        handleRequest(player, websocketInterface.buildRequest(message));
      });

      connection.on('close', (reasonCode, description) => {
        console.log(`Peer ${connection.remoteAddress} disconnected: ${reasonCode}, ${description}`);
        handlePlayerLeave(player);
      });
    }, delay);
  };
};
