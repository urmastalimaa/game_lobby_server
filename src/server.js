const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const R = require('ramda');
const http = require('http');
const WebSocketServer = require('websocket').server;
const ArgumentParser = require('argparse').ArgumentParser;

const GameLobby = require('./GameLobby');
const handleOnlinePlayers = require('./OnlinePlayers');

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

parser.addArgument(
  ['--port'],
  {
    help: 'Port to start server on',
    type: 'int',
    defaultValue: 8081,
    required: false,
    dest: 'port'
  }
);

parser.addArgument(
  ['--failure-percentage'],
  {
    help: 'Percentage of requests to arbitrarily fail',
    type: 'int',
    defaultValue: 0,
    required: false,
    dest: 'failurePercentage'
  }
);

const args = parser.parseArgs();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const gameLobby = new GameLobby();

const respond = (fn) => {
  setTimeout(fn, args.delay);
};

const forcedToFail = () =>
  Math.random() * 100 < args.failurePercentage;

app.post('/games', (req, res) => {
  if (forcedToFail()) {
    res.status(503).send({error: 'Service currently unavailable'});
    return;
  }

  console.log('Create game', req.body);
  gameLobby.createGame(
    req.body,
    ({body, status}) => {
      respond(() => {
        console.log('Create game response', body, status);
        res.status(status).json(body);
      });
    }
  );
});

app.post('/games/:gameId/moves', (req, res) => {
  if (forcedToFail()) {
    res.status(503).send({error: 'Service currently unavailable'});
    return;
  }

  console.log('Create move', R.merge(req.params, req.body));
  gameLobby.applyMove(
    R.merge(req.params, req.body),
    ({body, status}) => {
      respond(() => {
        console.log('Create move response', body, status);
        res.status(status).json(body);
      });
    }
  );
});

const server = http.createServer(app);

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', handleOnlinePlayers({delay: args.delay}));

server.listen(args.port, function() {
  console.log(`${new Date()} Server is listening on port ${args.port}`);
});
