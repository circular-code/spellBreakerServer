import * as db from 'mysql';
import * as Models from './models';
import {Collections} from './collections';

var pool  = db.createPool({
	host     : 'localhost',
	database: 'spellbreaker',
	user     : "mcdev",
	password : "devtron666"
  });

export function userLogin(socket, activeUsers: Collections.Dictionary<string, Models.User>, io)
{
    socket.on('user:login', function (data)
    {
    
        console.log(data);

        pool.getConnection(function(err, connection) {
            // Use the connection
            if(!connection) {
                console.log("no connection");
                socket.emit('connection:error', { data: 'no connection' } );
                data = null;
                return;
            } else {
				//get user query
				let sql = 'CALL GetUser(?)';
                connection.query(sql, data['username'], function(err, rows) {
                    if(err) {
                        console.log(err);
                        socket.emit('connection:error', { data: 'database' } );
                        connection.release();
                        return;
                    }
										
					let resultUserData = rows[0];
					if(resultUserData.length == 0) {
                        socket.emit('user:login:notfound', { data: 'no user' } );
                        console.log("User not found.");
                        connection.release();
                        return;
					}

					//loop through sql result
                    Object.keys(resultUserData).forEach(function(key){
                        if(resultUserData[key]['password'] == data['password']) {

							//create user object
							let user = new Models.User(data['username'], resultUserData[key]['id'], socket.id, resultUserData[key]['challengeId']);

                            if(!checkIfUserLoggedIn(activeUsers, user))
                            {
                                console.log("password correct");
                                socket.emit('user:login', { data: resultUserData[key]['id'] } );

                                //activeUsers.add(socket.id, new Models.User(data['username'], rows[key]['id'], socket.id));
                                console.log(activeUsers);
								activeUsers.add(socket.id, new Models.User(data['username'], resultUserData[key]['id'], socket.id, resultUserData[key]['challengeId']));
								console.log(activeUsers);
                                return;
                            } else {
                                console.log("user already logged in");
                                socket.emit('user:alreadyLoggedIn', { data: 'already logged in' });
                                return;
                            }
                        } else {
                            console.log("wrong password.")
                            socket.emit('user:login', { data: 'bad pass' } );
                            return;
                        }
                    });
                    // Don't use the connection here, it has been returned to the pool.
                });
            }
        });
    });
}

//return false is user is not logged in
export function checkIfUserLoggedIn(activeUsers: Collections.Dictionary<string, Models.User>, user)
{
    if(activeUsers.count() > 0)
    {
		return activeUsers.hasJsonValue(user, "id");
    } else {
        return false;
    }    
}

//add user to registered lfm clients
export function registerUserForMatchMaking(socket, lfmClients: Models.lfmClient)
{
    socket.on('register:for:match', function(data)
    {
       if(lfmClients == null || socket.id in lfmClients == false) {
            console.log("lfm undefined");

            pool.getConnection(function(err, connection) {
                if(!connection) {
                    console.log("no connection");
                    socket.emit('connection:error', { data: 'no connection' } );
                    socket.disconnect(true);
                    return;
                } else {
                    if(lfmClients[socket.id] == null) {                                
                        //stats: rows[key]
                        lfmClients[socket.id] = socket.id; 
                        connection.release();
                        return;
                    }
                }
            });
        }            
    });
}


/*
*	=> später aufteilen in kleinere funktionen
*
*
*/
export function validateSpell(socket, data, match, io, callback)
{
    var defendingPlayer: Models.Player = match.getPlayers().find(function(element) {
        return element['socket_id'] != socket.id;
    });

    var castingPlayer: Models.Player = match.getPlayers().find(function(element) {
        return element['socket_id'] == socket.id;
    });

	//damage timeout
    let timeout: any = setTimeout(function() {
		// timeout für verteidigenden spieler um zu reagieren
		console.log("attack not blocked");
        defendingPlayer.setHealth(defendingPlayer.getHealth() - 10);	
        console.log("healt: " + defendingPlayer.getHealth());

        io.sockets.sockets[castingPlayer.getID()].emit('spell:result', { success: true, result: { id: defendingPlayer.getID(), health: defendingPlayer.getHealth() } });
        io.sockets.sockets[defendingPlayer.getID()].emit('spell:result', { success: true, result: { id: defendingPlayer.getID(), health: defendingPlayer.getHealth() } });
        
        if(defendingPlayer.getHealth() <= 0)
        {
			console.log("end match");
			match.setInProgress(false);	
			//io.sockets.sockets[castingPlayer.getID()].emit('endMatch');
        	//io.sockets.sockets[defendingPlayer.getID()].emit('endMatch');
            callback(match, io);
        }
	}, 5000);
    
	io.sockets.sockets[defendingPlayer.getID()].emit('spell:pending', { data: "" });

	defendingPlayer.addPendingSpell(timeout);
}

export function defendSpell(socket, data, match, io)
{
	console.log("defend spell");
	let player = match.getPlayers().find(x => x['socket_id'] == socket.id);
	console.log(player);
	if(player.getPendingSpells().length > 0)
	{
        player.deleteFirstPendingSpell();
        socket.emit('spell:blocked', { data: "" });
	}
}

export function endMatch(match, io)
{
	console.log("end match");
	match.getPlayers().forEach(element => {
        io.sockets.sockets[element.getID()].emit('endMatch', { data: "End Match Data" });
    });
}

export function moveUsersToMatchRoom(matches: Collections.Dictionary<string, Models.Match>, lfmClients: Models.lfmClient, io) {
    	
	if(Object.keys(lfmClients).length > 1)
	{
		//get player1 data and create player1 object
		var keys = Object.keys(lfmClients);            
		var tempPlayer = keys[Math.floor(keys.length * Math.random())];
		var player1 = new Models.Player(lfmClients[tempPlayer], 100);
		delete(lfmClients[tempPlayer]);
		
		//get player2 data and create player2 object
		keys = Object.keys(lfmClients);
        tempPlayer = keys[Math.floor(keys.length * Math.random())];
        var player2 = new Models.Player(lfmClients[tempPlayer], 100);
		delete(lfmClients[tempPlayer]);

		if(player2 != undefined && player1 != undefined) {
		
			var players:Models.Player[] = [ player1, player2 ];

			//create a new match
			var match = this.createRoom(players, matches);
			while(match == undefined || match == null)
			{
				match = this.createRoom(players, matches);
			}

            //emit to players
			io.sockets.sockets[player1.getID()].join(match.id, () => {
				io.sockets.sockets[player1.getID()].emit('match:joined', { data: match.getId(), startPlayerID: match.playerDraw, thisPlayerID: player1, opponentPlayer: player2 });
			});
			io.sockets.sockets[player2.getID()].join(match.id, () => {
				io.sockets.sockets[player2.getID()].emit('match:joined', { data: match.getId(), startPlayerID: match.playerDraw, thisPlayerID: player2, opponentPlayer: player1 });
			});
		}
	}
}

//creates and returns a new match; returns null if match with same id already exists
export function createRoom(players: Models.Player[], matches: Collections.Dictionary<string, Models.Match>): Models.Match
{
	var tempPlayer = Math.floor(players.length * Math.random());
    var match = new Models.Match((Math.random() + 1).toString(36).substring(8), players, players[tempPlayer].getID());
    
	if(!matches.containsKey(match.getId())){

        matches.add(match.getId(), match);     
        return match;
        
	} else {
		return null;
	}
}

export function useSpell(socket, matches, io)
{
    socket.on('match:useSpell', function(data)
    {
        console.log(data['values']);
        var spell: Models.Spell = new Models.Spell(0, "Test", data['values']);
        var match = matches[data['match_id']];       

        console.log(spell);
        console.log(match);

    });
}

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {
  
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
