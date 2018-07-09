"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("mysql");
const Models = require("./models");
var pool = db.createPool({
    host: 'localhost',
    database: 'spellbreaker',
    user: "mcdev",
    password: "devtron666"
});
/*var connection = db.createConnection({
    host: 'h2778219.stratoserver.net:3306',
    database: 'dev',
    username: 'devinator',
    password: 'devtron12000'
});*/
function userLogin(socket, activeUsers) {
    socket.on('user:login', function (data) {
        console.log(data);
        pool.getConnection(function (err, connection) {
            // Use the connection
            if (!connection) {
                console.log("no connection");
                socket.emit('connection:error', { data: 'no connection' });
                data = null;
                return;
            }
            else {
                connection.query("SELECT * FROM users WHERE username = '" + data['username'] + "'", function (err, rows) {
                    if (err) {
                        console.log(err);
                        socket.emit('connection:error', { data: 'database' });
                        connection.release();
                        data = null;
                        return;
                    }
                    // And done with the connection.
                    if (rows.length == 0) {
                        socket.emit('user:login:notfound', { data: 'no user' });
                        console.log("User not found.");
                        connection.release();
                        data = null;
                        return;
                    }
                    //console.log(activeUsers)
                    Object.keys(rows).forEach(function (key) {
                        if (rows[key]['password'] == data['password']) {
                            if (!checkIfUserLoggedIn(activeUsers, rows[key]['id'])) {
                                console.log("password correct");
                                socket.emit('user:login', { data: rows[key]['id'] });
                                activeUsers.set(socket.id, new Models.User(data['username'], rows[key]['id'], socket.id));
                                data = null;
                                return;
                            }
                            else {
                                console.log("user already logged in");
                                socket.emit('user:alreadyLoggedIn', { data: 'already logged in' });
                                data = null;
                                return;
                            }
                        }
                        else {
                            console.log("wrong password.");
                            socket.emit('user:login', { data: 'bad pass' });
                            data = null;
                            return;
                        }
                    });
                    // Don't use the connection here, it has been returned to the pool.
                });
            }
        });
    });
}
exports.userLogin = userLogin;
function checkIfUserLoggedIn(activeUsers, id) {
    if (activeUsers.size > 0) {
        let arr = Array.from(activeUsers.values());
        return arr.some(x => x['id'] === id);
    }
    else {
        return false;
    }
}
exports.checkIfUserLoggedIn = checkIfUserLoggedIn;
function registerUserForMatchMaking(socket, lfmClients) {
    socket.on('register:for:match', function (data) {
        if (lfmClients == null || socket.id in lfmClients == false) {
            console.log("lfm undefined");
            pool.getConnection(function (err, connection) {
                if (!connection) {
                    console.log("no connection");
                    socket.emit('connection:error', { data: 'no connection' });
                    socket.disconnect(true);
                    return;
                }
                else {
                    if (lfmClients[socket.id] == null) {
                        //stats: rows[key]
                        lfmClients[socket.id] = socket.id;
                        connection.release();
                        return;
                    }
                }
            });
        }
        //console.log(data); 
    });
}
exports.registerUserForMatchMaking = registerUserForMatchMaking;
function validateSpell(socket, data, match, io) {
    /*console.log(data);
    console.log(data['gestureData']);
    console.log(data['gestureData']['lines']);
    console.log(data['gestureData']['lines'].length);*/
    data['gestureData']['lines'].forEach(element => {
        console.log(element);
    });
    var defendingPlayer = match.getPlayers().find(function (element) {
        return element['socket_id'] != socket.id;
    });
    var castingPlayer = match.getPlayers().find(function (element) {
        return element['socket_id'] == socket.id;
    });
    console.log(match);
    console.log(match.getPlayers());
    console.log(defendingPlayer);
    defendingPlayer.setHealth(defendingPlayer.getHealth() - 10);
    io.sockets.sockets[castingPlayer.getID()].emit('spell:result', { success: true, result: defendingPlayer });
    io.sockets.sockets[defendingPlayer.getID()].emit('spell:result', { success: true, result: defendingPlayer });
}
exports.validateSpell = validateSpell;
function endMatch(socket, matches, io, data, winner) {
}
exports.endMatch = endMatch;
function moveUsersToMatchRoom(matches, lfmClients, io) {
    if (Object.keys(lfmClients).length > 1) {
        var keys = Object.keys(lfmClients);
        var tempPlayer = keys[Math.floor(keys.length * Math.random())];
        var player1 = new Models.Player(lfmClients[tempPlayer], 100);
        delete (lfmClients[tempPlayer]);
        keys = Object.keys(lfmClients);
        tempPlayer = keys[Math.floor(keys.length * Math.random())];
        var player2 = new Models.Player(lfmClients[tempPlayer], 100);
        delete (lfmClients[tempPlayer]);
        if (player2 != undefined && player1 != undefined) {
            var players = [player1, player2];
            var match = this.createRoom(players, matches);
            while (match == undefined || match == null) {
                match = this.createRoom(players, matches);
            }
            io.sockets.sockets[player1.getID()].join(match.id, () => {
                io.sockets.sockets[player1.getID()].emit('match:joined', { data: match.getId(), startPlayerID: match.playerDraw, thisPlayerID: player1, opponentPlayer: player2 });
            });
            io.sockets.sockets[player2.getID()].join(match.id, () => {
                io.sockets.sockets[player2.getID()].emit('match:joined', { data: match.getId(), startPlayerID: match.playerDraw, thisPlayerID: player2, opponentPlayer: player1 });
            });
        }
    }
}
exports.moveUsersToMatchRoom = moveUsersToMatchRoom;
function createRoom(players, matches) {
    var tempPlayer = Math.floor(players.length * Math.random());
    var match = new Models.Match((Math.random() + 1).toString(36).substring(8), players, players[tempPlayer].getID());
    if (matches[match.getId()] == null) {
        matches[match.getId()] = match;
        return match;
    }
    else {
        return null;
    }
}
exports.createRoom = createRoom;
function useSpell(socket, matches, io) {
    socket.on('match:useSpell', function (data) {
        console.log(data['values']);
        var spell = new Models.Spell(0, "Test", data['values']);
        var match = matches[data['match_id']];
        console.log(spell);
        console.log(match);
    });
}
exports.useSpell = useSpell;
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}
