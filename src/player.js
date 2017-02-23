const uuid = require('node-uuid');

class Player {
  constructor({connection, name}) {
    this._connection = connection;
    this.name = name;
    this.id = uuid.v4();
  }

  notify(message) {
    this._connection.notify(message);
  }
}

module.exports = Player;
