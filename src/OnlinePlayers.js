const uuid = require('uuid');

const CONNECTION_REJECT_REASONS = {
  nameTaken: 'player-name-taken'
};

module.exports = ({delay}) => {
  let players = [];

  const send = (connection) => (eventName, payload) => {
    setTimeout(
      () => {
        if (connection.connected) {
          connection.send(JSON.stringify({eventName, payload}));
        }
      },
      delay
    );
  };

  const notifyEveryoneOfPlayers = () => {
    const payload = players.map((player) =>
      ({id: player.id, name: player.name})
    );
    players.forEach((player) => {
      send(player.connection)('online-players', payload);
    });
  };

  return (httpRequest) => {
    setTimeout(() => {
      const queryParameters = httpRequest.resourceURL.query || {};
      const playerName = queryParameters.playerName;
      const playerId = uuid.v4();

      const connection = httpRequest.accept(httpRequest.requestedProtocols[0], httpRequest.origin);

      if (players.find((player) => player.name === playerName)) {
        connection.close(4000, CONNECTION_REJECT_REASONS.nameTaken);
        return;
      }

      send(connection)('connection:accepted', {playerId});
      players = players.concat({id: playerId, name: playerName, connection});
      notifyEveryoneOfPlayers();

      connection.on('close', () => {
        players = players.filter((player) => player.id !== playerId);
        notifyEveryoneOfPlayers();
      });
    }, delay);
  };
};
