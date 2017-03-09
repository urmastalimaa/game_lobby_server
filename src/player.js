class Player {
  constructor({id, connection, name}) {
    this._connection = connection;
    this.name = name;
    this.id = id;
  }

  notify(message) {
    this._connection.notify(message);
  }

  serialize() {
    return {id: this.id, name: this.name};
  }
}

module.exports = Player;
