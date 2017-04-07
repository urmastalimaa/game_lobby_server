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
* _type_: `String`(_guess_number_|_guess_word_)

Response `{id, type, status}`
* _id_: `String`
* _type_: `String`(_guess_number_|_guess_word_)
* _status_: `String`(_waiting_for_move_)

#### POST _/games/:gameId/moves_

Request Body Parameters
* _guess: `Integer`

##### Game type: _guess_number_

Response `{move, game}`

* _move_: `{comparedToAnswer, guess}`
  * comparedToAnswer: String(LT,GT,EQ)
  * guess: Integer, echo of the submitted guess
* _game_: `{id, type, status}`
  * id: String
  * type: String(guess_number)
  * status: String(waiting_for_move|finished)

##### Game type: _guess_word_

Request Body Parameters
* _guess: `String`

Response `{move, game}`

* _move_: `{correct, letterMatches, guess}`
  * _correct_: `Boolean`
  * _letterMatches_: `Array[Boolean]`, true if character at position was correct, false otherwise
  * _guess_: `String`, echo of the submitted guess
* _game_: `{id, type, status}`
  * _id_: `String`
  * _type_: `String`(_guess_word_)
  * _status_: `String`(_waiting_for_move_|_finished_)
