import { createServer, Server } from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import * as db from 'mysql';
import * as Models from './lib/models';
import * as ServerMethods from './lib/server_functions';
import {Collections} from './lib/collections';

var pool  = db.createPool({
	host     : 'localhost',
	database: 'spellbreaker',
	user     : "mcdev",
	password : "devtron666"
  });

//const activeUsers: Map<string, Models.User> = new Map<string, Models.User>();
const lfmClients: Models.lfmClient = {};
//const matches: Map<string, Models.Match> = new Map<string, Models.Match>();
const activeUsers: Collections.Dictionary<string, Models.User> = new Collections.Dictionary<string, Models.User>();
const matches: Collections.Dictionary<string, Models.Match> = new Collections.Dictionary<string, Models.Match>();

export class AppServer {
    public static readonly PORT:number = 4567;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
	private port: string | number;

    //private activeUsers: activeUser;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();     

        setInterval(() => ServerMethods.moveUsersToMatchRoom(matches, lfmClients, this.io), 1000);
        //setInterval(() => console.log(matches), 500);
        //this.activeUsers = {};
        /*this.activeUsers = new Models.User("name", 0, "socket");
        console.log(this.activeUsers);
        console.log(this.activeUsers["lalala"]);*/
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || AppServer.PORT;
    }

    private sockets(): void {
        this.io = SocketIO(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running spellbreaker server on port %s', this.port);
        });

		var io: SocketIO.Server = this.io;
		var appServer: AppServer = this;


        this.io.on('connection', function(socket: SocketIO.Socket){

            //console.log(socket);
            
            //console.log(io.nsps);
            //console.log(socket.nsp.name);
            /*socket.on('beep', function(){
                socket.emit('boop');
            });

            /*socket.on('user:login', function(data){
                activeUsers.push(data['user_id']);
            });*/
            
            ServerMethods.userLogin(socket, activeUsers);

            ServerMethods.registerUserForMatchMaking(socket, lfmClients);	
        
            //ServerMethods.useSpell(socket, matches, io);

            socket.on('player:cast:spell', (data) => {
                console.log("player casted spell");
                console.log(matches);
                if(matches.containsKey(data['match_id']))
                {
					//var tmpMatches = new Map(matches);
                    var match = matches.getValue(data['match_id']);
					//matches.set(match.getId(), match);					
                    ServerMethods.validateSpell(socket, data, match, io, appServer.endMatch);
                    //matches.add(match.getId(), match);
                }                
			});
			
			socket.on('player:defend:spell', (data) => {
				console.log("player:defend:spell")
                if(matches.containsKey(data['match_id']))
                {
					//var tmpMatches = new Map(matches);
					//console.log(tmpMatches);

					var match = matches.getValue(data['match_id']);
					//matches.set(match.getId(), match);
                    ServerMethods.defendSpell(socket, data, match, io);
                    //matches.add(match.getId(), match);
				}
			});

            socket.on('disconnect', (reason) => {
                if(activeUsers != null) 
                {
					console.log(activeUsers);
					//activeUsers.delete(socket.id);
					activeUsers.remove(socket.id);
                }
                if(lfmClients != null)
                {
                    delete(lfmClients[socket.id]);
                }
                if(matches != null)
                {              
                    /*let arr = Array.from(matches.values());

                    for(var i = 0; i < arr.length; i++)
                    {
                        if(arr[i].checkForSocketId(socket.id))
                        {
                            matches.delete(arr[i].getId());
                            break;
                        }
					}*/
					/*for(var i = 0; i < matches._keys.length; i++)
					{
						let match = matches[matches._keys[i]];
						console.log(match);
						//if()
					} */                        
                }
                console.log(reason);
                socket.conn.removeAllListeners();
                console.log(socket.conn.id);
                socket.disconnect(true);
            });	
        })        
    }  
    
    public endMatch(match: Models.Match) {
        //if(!match.getInProgress())
        //{
            //ServerMethods.endMatch(socket, match, io);
            matches.remove(match.getId());
        //}
    }

    public getApp(): express.Application {
        return this.app;
    }
}