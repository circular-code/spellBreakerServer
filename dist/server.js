"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const SocketIO = require("socket.io");
const db = require("mysql");
const ServerMethods = require("./lib/server_functions");
const collections_1 = require("./lib/collections");
var fs = require('fs');
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
    //error logger
    errorLogging() {
        process.on('uncaughtException', function (err) {
            console.log("throw log");
            let date = new Date().toISOString().replace(/T.+/, '');
            if (!fs.existsSync('logs/errLog-' + date)) {
                fs.writeFile('logs/errLog-' + date, err.message + err.stack + "\n\n=================\n\n", function (err) {
                    if (err)
                        throw err;
                    console.log("crashlog created");
                    process.exit();
                });
            }
            else {
                fs.appendFile('logs/errLog-' + date, err.message + err.stack + "\n\n=================\n\n", function (err) {
                    if (err)
                        throw err;
                    console.log("crashlog updated");
                    process.exit();
                });
            }
        });
    }
    sockets() {
        this.io = SocketIO(this.server);
    }
    listen() {
        //register errorLogger
        this.errorLogging();
        this.server.listen(this.port, () => {
            console.log('Running spellbreaker server on port %s', this.port);
        });
        var io = this.io;
        var appServer = this;
        this.io.on('connection', function (socket) {
            ServerMethods.userLogin(socket, activeUsers, io);
            ServerMethods.registerUserForMatchMaking(socket, lfmClients);
            socket.on('player:cast:spell', (data) => {
                //check if match is registered
                if (matches.containsKey(data['match_id'])) {
                    //get match			
                    var match = matches.getValue(data['match_id']);
                    ServerMethods.validateSpell(socket, data, match, io, appServer.endMatch);
                }
            });
            socket.on('player:defend:spell', (data) => {
                //check if match is registered
                if (matches.containsKey(data['match_id'])) {
                    //get match
                    var match = matches.getValue(data['match_id']);
                    ServerMethods.defendSpell(socket, data, match, io);
                }
            });
            socket.on('disconnect', (reason) => {
                if (activeUsers != null) {
                    //activeUsers.delete(socket.id);
                    activeUsers.remove(socket.id);
                }
                if (lfmClients != null) {
                    delete (lfmClients[socket.id]);
                }
                if (matches != null) {
                    let arr = Array.from(matches.values());
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].checkForSocketId(socket.id)) {
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
