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

* _type_: `String`(_guess_number_ | _guess_word_ | _hangman_ | _rps_)

Response `{id, type, status}`

* _id_: `String`
* _type_: `String`, echo of the submitted type
* _status_: `String`(_waiting_for_move_)

#### Game type: _hangman_

Additional response fields:

* _won_: `Boolean`, false
* _wrongGuessCount_: `Integer`, 0
* _letters_: `Array[String]`, list of letters in the target word, all letters
  are denoted with `null`

#### POST _/games/:gameId/moves_

##### Game type: _guess_number_

Request Body Parameters

* _guess_: `Integer`

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

##### Game type: _hangman_

Request Body Parameters

* _guess_: `String`

Response:

* _id_: `String`
* _type_: `String`(_hangman_)
* _status_: `String`(_waiting_for_move_ | _finished_)
* _won_: `Boolean`, whether the game has finished with a victory
* _wrongGuessCount_: `Integer`, number of invalid guesses thus far
* _letters_: `Array[String]`, list of letters that have been already guessed,
  letters which have not been guessed are denoted with `null`
* _move_: `{matchedLetterCount, guess}`
    * _matchedLetterCount_: `Integer`, how many letters of the target word matched the input
    * _guess_: `String`, echo of the submitted guess

##### Game type: _rps_

Request Body Parameters

* _guess_: `String`

Response:

* _id_: `String`
* _type_: `String`(_rps_)
* _status_: `String`(_waiting_for_move_ | _finished_)
* _won_: `Boolean`, whether the game has finished with a victory
* _move_: `{result, opposition, guess}`
    * _result_: `String`(_WIN_, _TIE_, _LOSS_), result of the
      Rock-Paper-Scissors round
    * _opposition_: `String`(_ROCK_, _PAPER_, _SCISSORS_), the opposition for the round
    * _guess_: `String`, echo of the submitted guess

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
