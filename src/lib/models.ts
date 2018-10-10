//import {Serializable, Serialize, SerializeOpt, SerializeArray} from "ts-serialize";

export class User {
    constructor(private name: string, private id: number, private socket_id: string, private challenge_id: string) { }

    getId(): number{
        return this.id;
	}
	
	getChallengeId(): string{
		return this.challenge_id;
	}
}

export interface activeUser {
	[id: number]: User;	
}

export interface lfmClient{
    [id: string]: string;
}

export interface activeMatches{
	[id: string]: Match;
}

export class Vector2 {
    constructor(public x: number, public y: number) { }
}

export class Stats{
    constructor(private attack: number, private defense: number, private life: number, private energy: number, private willpower: number) { }

    getAttack(): number
    {
        return this.attack;
    }

    getDefense(): number
    {
        return this.defense;
    }

    getLife(): number
    {
        return this.life;
    }

    getEnergy(): number
    {
        return this.energy;
    }

    getWillpower(): number
    {
        return this.willpower;
    }
}

export class Character {
    private maxLife: number;
    private curLife: number;
    private maxEnergy: number;
    private curEnergy: number;
    private stats: Stats;

    constructor(private id: number, private name: string, private level: number, private portrait_id: number, private class_id: number) { }

    Init()
    {
        if(this.stats)
        {
            this.maxLife = this.stats.getLife();
            this.maxEnergy = this.stats.getEnergy();
            this.curLife = this.maxLife;
            this.curEnergy = this.maxEnergy;
        }
    }

    setStats(_stats: Stats)
    {
        this.stats = _stats;
    }

    getStats(): Stats
    {
        return this.stats;
    }

    setMaxLife()
    {
        this.maxLife = this.stats.getLife();
    }

    getMaxLife(): number
    {
        return this.maxLife;
    }

    setCurLife(_curLife: number)
    {
        this.curLife = _curLife;
    }

    getCurLife(): number
    {
        return this.curLife;
    }

    setMaxEnergy()
    {
        this.maxEnergy = this.stats.getEnergy(); 
    }

    getMaxEnergy(): number
    {
        return this.maxEnergy;
    }

    setCurEnergy(_curEnergy: number)
    {
        this.curEnergy = _curEnergy;
    }

    getCurEnergy(): number
    {
        return this.curEnergy;
    }
}

/*export interface PendingSpell {
	: Array<any>;
}*/

export class Player {
    constructor(private socket_id: string, private health: number, private pendingSpells?: any) {
		this.pendingSpells = [];
	}

    setID(_id: string)
    {
        this.socket_id = _id;
    }

    getID(): string
    {
        return this.socket_id;
    }

    setHealth(_health: number)
    {
        this.health = _health;
    }

    getHealth(): number
    {
        return this.health;
	}    
	
	addPendingSpell(_id: any)
	{
		this.pendingSpells.push(_id);
	}

	deleteFirstPendingSpell()
	{
		console.log("pending spell blocked");
		let timeOut = this.pendingSpells.shift();
		clearTimeout(timeOut);
	}

	deletePendingSpell(_id: any)
	{
		this.pendingSpells.splice(this.pendingSpells.indexOf(_id), -1);
	}

	getPendingSpells(): any
	{
		return this.pendingSpells;
	}
}

export class Match {
    constructor(private id: string, private players: Array<Player>, private playerDraw: string, private inProgress?: boolean) {
		this.inProgress = true;
	}

    getId(): string
    {
        return this.id;
    }

    getPlayers(): Array<Player>
    {
        return this.players;
    }

    setPlayerDraw(_playerDraw: Player)
    {
        this.playerDraw = _playerDraw.getID();
    }

    getPlayerDraw(): string
    {
        return this.playerDraw;
    }

    checkForSocketId(_id: string): any
    {
        return this.players.some(x => x.getID() == _id);
	}
	
	getInProgress(): boolean
	{
		return this.inProgress;
	}

	setInProgress(_progress: boolean)
	{
		this.inProgress = _progress;
	}
}

export class Spell
{

    constructor(private id: number, private name: string, private values: string) 
    {
    }

    getName(): string
    {
        return this.name;
    }

    getId(): number
    {
        return this.id;
    }

    setValues(_values: string)
    {
        this.values = _values;
    }

    getValues(): string
    {
        return this.values;
    }
}

export interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}

export class Dictionary {

    _keys: string[] = new Array<string>();
    _values: any[] = new Array<any>();

    constructor(init: { key: string; value: any; }[]) {
        for (var x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }

    add(key: string, value: any) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    remove(key: string) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);

        delete this[key];
    }

    keys(): string[] {
        return this._keys;
    }

    values(): any[] {
        return this._values;
	}
	
	containsValue(value: any)
	{
		if(typeof this[value] === "undefined")
		{
			false;
		}

		return true;
	}

    containsKey(key: string) {
        if (typeof this[key] === "undefined") {
            return false;
        }

        return true;
	}
	
	get(key: string): any
	{
		var index = this._keys.indexOf(key, 0);
		return this._values[index];
	}

    toLookup(): IDictionary {
        return this;
    }
}


