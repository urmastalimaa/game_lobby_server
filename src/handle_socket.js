const {
  handleNewConnection,
  handleConnectionClose,
  handleMessage
} = require('./game_lobby');

module.exports = (request) => {
  const connection = request.accept('echo-protocol', request.origin);
  handleConnection(connection);
};

const handleConnection = (connection) => {
  handleNewConnection(connection);
  connection.on('message', handleMessage(connection));

  connection.on('close', (reasonCode, description) => {
    console.log(`Peer ${connection.remoteAddress} disconnected: ${reasonCode}, ${description}`);
    handleConnectionClose(connection);
  });
};
