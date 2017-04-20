# Game Lobby Server

A server for [Interactive Frontend Development course](https://courses.cs.ut.ee/2017/react/spring/) project.

## Usage

### When imported as a library

```
game_lobby_server --help
game_lobby_server --delay=500 --port=8081 --failure-percentage=30
```

### When used as a stand-alone

```
./bin/server.js --help
./bin/server.js --delay=500 --port=8081 --failure-percentage=30
```

or 
```
npm start
```

### Endpoints

#### POST _/games/_

Request Body Parameters
* _type_: `String`(_guess_number_ | _guess_word_)

Response `{id, type, status}`
* _id_: `String`
* _type_: `String`(_guess_number_ | _guess_word_), echo of the submitted type
* _status_: `String`(_waiting_for_move_)

#### POST _/games/:gameId/moves_

Request Body Parameters
* _guess_: `Integer`

##### Game type: _guess_number_

Response `{move, game}`

* _move_: `{comparedToAnswer, guess}`
    * comparedToAnswer: `String`(_LT_ | _GT_ | _EQ_)
    * guess: `Integer`, echo of the submitted guess
* _game_: `{id, type, status}`
    * id: `String`
    * type: `String`(_guess_number_)
    * status: `String`(_waiting_for_move_ | _finished_)

##### Game type: _guess_word_

Request Body Parameters
* _guess_: `String`

Response `{move, game}`

* _move_: `{correct, letterMatches, guess}`
    * _correct_: `Boolean`
    * _letterMatches_: `Array[Boolean]`, true if character at position was correct, false otherwise
    * _guess_: `String`, echo of the submitted guess
* _game_: `{id, type, status}`
    * _id_: `String`
    * _type_: `String`(_guess_word_)
    * _status_: `String`(_waiting_for_move_ | _finished_)

### WebSocket API

#### Required query parameters

Pass query parameters in the URL when connection to the server, e.g connect to the following URL:
```
ws://localhost:8081/?playerName=foo
```

Required parameters:

* _playerName_: `String`, the name the connecting player wants to use.

#### Error codes

If the connection cannot be accepted for any reason, the connection is closed with

* `code:4000, reason:'player-name-taken'`, if player is not allowed to connect due to the provided name not being available.

#### Messages

WebSocket API pushes messages as JSON objects encoded as UTF-8 strings.

The encoded JSON object has the following properties:

* _eventName_: `String`, name of the event
* _payload_: `Object`, payload of the event

Example frame that might be sent to a connection:
```
'{"eventName":"connection:accepted","payload":{"playerId":"b00e6b69-ae49-431f-8dbd-12d7b5c95153"}}'
```

The following events might be sent

* _connection:accepted_: `{playerId}`, sent immediately after connection is opened.
    * _playerId_: `String`, an unique ID given to the connected player
* _online-players_: `Array[{id, name}]`, list of online players, sent whenever a player connects or disconnects.
    * _id_: `String`, unique identifier of the player
    * _name_: `String`, name of the player
