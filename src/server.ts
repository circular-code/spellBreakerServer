import { createServer, Server } from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import * as db from 'mysql';
import * as Models from './lib/models';
import * as ServerMethods from './lib/server_functions';

var pool  = db.createPool({
	host     : 'localhost',
	database: 'spellbreaker',
	user     : "mcdev",
	password : "devtron666"
  });

const activeUsers: Map<string, Models.User> = new Map<string, Models.User>();
const lfmClients: Models.lfmClient = {};
const matches = {};

export class AppServer {
    public static readonly PORT:number = 4567;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    //private activeUsers: activeUser;
    private matches;

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

    private sockets(): void {
        this.io = SocketIO(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running spellbreaker server on port %s', this.port);
        });

        var io: SocketIO.Server = this.io;


        this.io.on('connection', function(socket: SocketIO.Socket){
            var userId;
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
                var match = matches[data['match_id']];
                ServerMethods.validateSpell(socket, data, match, io);
            });

            socket.on('disconnect', (reason) => {
                if(activeUsers != null) 
                {
                    activeUsers.delete(socket.id);
                }
                if(lfmClients != null)
                {
                    delete(lfmClients[socket.id]);
                }
                console.log(reason);
                socket.conn.removeAllListeners();
                console.log(socket.conn.id);
                socket.disconnect(true);
            });	
        })        
    }    

    public getApp(): express.Application {
        return this.app;
    }
}