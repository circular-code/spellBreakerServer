import { createServer, Server } from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import * as db from 'mysql';
import * as Models from './lib/models';
import * as ServerMethods from './lib/server_functions';
import {Collections} from './lib/collections';

var fs = require('fs');

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

	//error logger
    private errorLogging(): void {
        process.on('uncaughtException', function(err) {
            console.log(err);
            let date = new Date().toISOString().replace(/T.+/, '');
            if(!fs.existsSync('logs/errLog-' + date))
            {
                fs.writeFile('logs/errLog-' + date, err.message + err.stack + "\n\n=================\n\n", function(err){
                    if (err) throw err;
                    console.log("crashlog created");
                });
            } else {
                fs.appendFile('logs/errLog-' + date, err.message + err.stack + "\n\n=================\n\n", function(err){
                    if (err) throw err;
                    console.log("crashlog updated");
                });
			}
			process.exit();
        });
    }

    private sockets(): void {
        this.io = SocketIO(this.server);
    }

    private listen(): void {

        //register errorLogger
        this.errorLogging();

        this.server.listen(this.port, () => {
            console.log('Running spellbreaker server on port %s', this.port);
        });

		var io: SocketIO.Server = this.io;
		var appServer: AppServer = this;

        this.io.on('connection', function(socket: SocketIO.Socket){
            console.log("new socket connected");
            ServerMethods.userLogin(socket, activeUsers, io);

            ServerMethods.registerUserForMatchMaking(socket, lfmClients);	
        
            socket.on('player:cast:spell', (data) => {

                //check if match is registered
                if(matches.containsKey(data['match_id']))
                {		
                    //get match			
					var match = matches.getValue(data['match_id']);
					ServerMethods.validateSpell(socket, data, match, io, appServer.endMatch);
                }                
			});
			
			socket.on('player:defend:spell', (data) => {

                //check if match is registered
                if(matches.containsKey(data['match_id']))
                {
                    //get match
					var match = matches.getValue(data['match_id']);
					ServerMethods.defendSpell(socket, data, match, io);
				}
			});

            socket.on('disconnect', (reason) => {
                if(activeUsers != null) 
                {
					//activeUsers.delete(socket.id);
					activeUsers.remove(socket.id);
                }
                if(lfmClients != null)
                {
                    delete(lfmClients[socket.id]);
                }
                if(matches != null)
                {                          
                    let arr = Array.from(matches.values());

                    for(var i = 0; i < arr.length; i++)
                    {
                        if(arr[i].checkForSocketId(socket.id))
                        {
                            var match = matches.getValue(matches.keys()[i]);

                            match.getPlayers().forEach(element => {
                                if(element.getID() != socket.id)
                                {
                                    io.sockets.sockets[element.getID()].emit('endMatch', { data: "End Match Data" });
                                }
                            });
                            matches.remove(matches.keys()[i]);
                            break;
                        }
					}
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