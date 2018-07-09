"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const SocketIO = require("socket.io");
const db = require("mysql");
const ServerMethods = require("./lib/server_functions");
var pool = db.createPool({
    host: 'localhost',
    database: 'spellbreaker',
    user: "mcdev",
    password: "devtron666"
});
const activeUsers = new Map();
const lfmClients = {};
const matches = {};
class AppServer {
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
    sockets() {
        this.io = SocketIO(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running spellbreaker server on port %s', this.port);
        });
        var io = this.io;
        this.io.on('connection', function (socket) {
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
            ServerMethods.useSpell(socket, matches, io);
            socket.on('player:cast:spell', (data) => {
                console.log("player casted spell");
                console.log(matches);
                var match = matches[data['match_id']];
                ServerMethods.validateSpell(socket, data, match, io);
            });
            socket.on('disconnect', (reason) => {
                if (activeUsers != null) {
                    activeUsers.delete(socket.id);
                }
                if (lfmClients != null) {
                    delete (lfmClients[socket.id]);
                }
                console.log(reason);
                socket.conn.removeAllListeners();
                console.log(socket.conn.id);
                socket.disconnect(true);
            });
        });
    }
    getApp() {
        return this.app;
    }
}
AppServer.PORT = 4567;
exports.AppServer = AppServer;
