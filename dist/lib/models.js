"use strict";
//import {Serializable, Serialize, SerializeOpt, SerializeArray} from "ts-serialize";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(name, id, socket_id) {
        this.name = name;
        this.id = id;
        this.socket_id = socket_id;
    }
    getId() {
        return this.id;
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
/*export interface PendingSpell {
    : Array<any>;
}*/
class Player {
    constructor(socket_id, health, pendingSpells) {
        this.socket_id = socket_id;
        this.health = health;
        this.pendingSpells = pendingSpells;
        this.pendingSpells = [];
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
    addPendingSpell(_id) {
        this.pendingSpells.push(_id);
    }
    deleteFirstPendingSpell() {
        console.log("pending spell blocked");
        let timeOut = this.pendingSpells.shift();
        clearTimeout(timeOut);
    }
    deletePendingSpell(_id) {
        this.pendingSpells.splice(this.pendingSpells.indexOf(_id), -1);
    }
    getPendingSpells() {
        return this.pendingSpells;
    }
}
exports.Player = Player;
class Match {
    constructor(id, players, playerDraw, inProgress) {
        this.id = id;
        this.players = players;
        this.playerDraw = playerDraw;
        this.inProgress = inProgress;
        this.inProgress = true;
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
    checkForSocketId(_id) {
        return this.players.some(x => x.getID() == _id);
    }
    getInProgress() {
        return this.inProgress;
    }
    setInProgress(_progress) {
        this.inProgress = _progress;
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
class Dictionary {
    constructor(init) {
        this._keys = new Array();
        this._values = new Array();
        for (var x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }
    add(key, value) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }
    remove(key) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key];
    }
    keys() {
        return this._keys;
    }
    values() {
        return this._values;
    }
    containsValue(value) {
        if (typeof this[value] === "undefined") {
            false;
        }
        return true;
    }
    containsKey(key) {
        if (typeof this[key] === "undefined") {
            return false;
        }
        return true;
    }
    get(key) {
        var index = this._keys.indexOf(key, 0);
        return this._values[index];
    }
    toLookup() {
        return this;
    }
}
exports.Dictionary = Dictionary;
