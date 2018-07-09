//import {Serializable, Serialize, SerializeOpt, SerializeArray} from "ts-serialize";

export class User {
    constructor(private name: string, private id: number, private socket_id: string) { }
}

export interface activeUser {
    [id: number]: User;
}

export interface lfmClient{
    [id: string]: string;
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

export class Player {
    constructor(private socket_id: string, private health: number) { }

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
}

export class Match {
    constructor(private id: string, private players: Array<Player>, private playerDraw: string) { }

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


