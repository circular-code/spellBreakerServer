"use strict";
//import {Serializable, Serialize, SerializeOpt, SerializeArray} from "ts-serialize";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(name, id, socket_id) {
        this.name = name;
        this.id = id;
        this.socket_id = socket_id;
    }
}
exports.User = User;
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Vector2 = Vector2;
class Stats {
    constructor(attack, defense, life, energy, willpower) {
        this.attack = attack;
        this.defense = defense;
        this.life = life;
        this.energy = energy;
        this.willpower = willpower;
    }
    getAttack() {
        return this.attack;
    }
    getDefense() {
        return this.defense;
    }
    getLife() {
        return this.life;
    }
    getEnergy() {
        return this.energy;
    }
    getWillpower() {
        return this.willpower;
    }
}
exports.Stats = Stats;
class Character {
    constructor(id, name, level, portrait_id, class_id) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.portrait_id = portrait_id;
        this.class_id = class_id;
    }
    Init() {
        if (this.stats) {
            this.maxLife = this.stats.getLife();
            this.maxEnergy = this.stats.getEnergy();
            this.curLife = this.maxLife;
            this.curEnergy = this.maxEnergy;
        }
    }
    setStats(_stats) {
        this.stats = _stats;
    }
    getStats() {
        return this.stats;
    }
    setMaxLife() {
        this.maxLife = this.stats.getLife();
    }
    getMaxLife() {
        return this.maxLife;
    }
    setCurLife(_curLife) {
        this.curLife = _curLife;
    }
    getCurLife() {
        return this.curLife;
    }
    setMaxEnergy() {
        this.maxEnergy = this.stats.getEnergy();
    }
    getMaxEnergy() {
        return this.maxEnergy;
    }
    setCurEnergy(_curEnergy) {
        this.curEnergy = _curEnergy;
    }
    getCurEnergy() {
        return this.curEnergy;
    }
}
exports.Character = Character;
class Player {
    constructor(socket_id, health) {
        this.socket_id = socket_id;
        this.health = health;
    }
    setID(_id) {
        this.socket_id = _id;
    }
    getID() {
        return this.socket_id;
    }
    setHealth(_health) {
        this.health = _health;
    }
    getHealth() {
        return this.health;
    }
}
exports.Player = Player;
class Match {
    constructor(id, players, playerDraw) {
        this.id = id;
        this.players = players;
        this.playerDraw = playerDraw;
    }
    getId() {
        return this.id;
    }
    getPlayers() {
        return this.players;
    }
    setPlayerDraw(_playerDraw) {
        this.playerDraw = _playerDraw.getID();
    }
    getPlayerDraw() {
        return this.playerDraw;
    }
}
exports.Match = Match;
class Spell {
    constructor(id, name, values) {
        this.id = id;
        this.name = name;
        this.values = values;
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.id;
    }
    setValues(_values) {
        this.values = _values;
    }
    getValues() {
        return this.values;
    }
}
exports.Spell = Spell;
