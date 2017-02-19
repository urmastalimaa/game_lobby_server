const WebsocketRequest = require('./websocket_request');

const {
  handleNewConnection,
  handleConnectionClose,
  handleRequest
} = require('./game_lobby');

module.exports = ({delay}) => {
  const buildRequest = WebsocketRequest.buildRequest({delay: delay});

  return (request) => {
    setTimeout(() => {
      const connection = request.accept('echo-protocol', request.origin);
      const requestFromMessage = buildRequest(connection);

      handleNewConnection(connection);

      connection.on('message', (message) => {
        handleRequest(requestFromMessage(message));
      });

      connection.on('close', (reasonCode, description) => {
        console.log(`Peer ${connection.remoteAddress} disconnected: ${reasonCode}, ${description}`);
        handleConnectionClose(connection);
      });
    }, delay);
  };
};
