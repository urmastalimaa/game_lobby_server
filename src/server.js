const http = require('http');
const WebSocketServer = require('websocket').server;

const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Game lobby server'
});

parser.addArgument(
  ['--delay'],
  {
    help: 'How long to delay before sending message, useful for generating latency',
    type: 'int',
    defaultValue: 0,
    required: false,
    dest: 'delay'
  }
);

const args = parser.parseArgs();

const handleIncomingRequest = require('./handle_socket');

const websocketPort = 8081;

const server = http.createServer(function(request, response) {
  console.log(`${new Date()} Received request for ${request.url}`);
  response.writeHead(404);
  response.end();
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', handleIncomingRequest({delay: args.delay}));

server.listen(websocketPort, function() {
  console.log(`${new Date()} Server is listening on port ${websocketPort}`);
});
