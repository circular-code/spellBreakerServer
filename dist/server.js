"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const SocketIO = require("socket.io");
const db = require("mysql");
const ServerMethods = require("./lib/server_functions");
const collections_1 = require("./lib/collections");
var pool = db.createPool({
    host: 'localhost',
    database: 'spellbreaker',
    user: "mcdev",
    password: "devtron666"
});
//const activeUsers: Map<string, Models.User> = new Map<string, Models.User>();
const lfmClients = {};
//const matches: Map<string, Models.Match> = new Map<string, Models.Match>();
const activeUsers = new collections_1.Collections.Dictionary();
const matches = new collections_1.Collections.Dictionary();
class AppServer {
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
    createApp() {
        this.app = express();
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || AppServer.PORT;
    }
    sockets() {
        this.io = SocketIO(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running spellbreaker server on port %s', this.port);
        });
        var io = this.io;
        var appServer = this;
        this.io.on('connection', function (socket) {
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
                if (matches.containsKey(data['match_id'])) {
                    //var tmpMatches = new Map(matches);
                    var match = matches.getValue(data['match_id']);
                    //matches.set(match.getId(), match);					
                    ServerMethods.validateSpell(socket, data, match, io, appServer.endMatch);
                    //matches.add(match.getId(), match);
                }
            });
            socket.on('player:defend:spell', (data) => {
                console.log("player:defend:spell");
                if (matches.containsKey(data['match_id'])) {
                    //var tmpMatches = new Map(matches);
                    //console.log(tmpMatches);
                    var match = matches.getValue(data['match_id']);
                    //matches.set(match.getId(), match);
                    ServerMethods.defendSpell(socket, data, match, io);
                    //matches.add(match.getId(), match);
                }
            });
            socket.on('disconnect', (reason) => {
                if (activeUsers != null) {
                    console.log(activeUsers);
                    //activeUsers.delete(socket.id);
                    activeUsers.remove(socket.id);
                }
                if (lfmClients != null) {
                    delete (lfmClients[socket.id]);
                }
                if (matches != null) {
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
        });
    }
    endMatch(match) {
        //if(!match.getInProgress())
        //{
        //ServerMethods.endMatch(socket, match, io);
        matches.remove(match.getId());
        //}
    }
    getApp() {
        return this.app;
    }
}
AppServer.PORT = 4567;
exports.AppServer = AppServer;
