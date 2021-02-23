import { timeStamp } from "console";
import { IPlayerDoc } from "../../db/model/player";
import { choose, takeChance } from "../../utils";

export interface IMonster {
    name: string;
    health: number;
    strikeProbability: number;
}

export enum FightStatus {
    Running,
    PlayerWon,
    MonsterWon,
    PlayerFlee
}

export enum PlayerDefense {
    attacking = 0,
    defending = 5
}

const PLAYER_RESPAWN_HEALTH = 20;
const INITIAL_STRIKE_PROBABILITY = 0.05;
const ATTACK_DAMAGE = 5;
const INITIAL_MONSTER_HEALTH = 20;
const MAX_EVENTS_LENGTH = 6;

export default class Fight {
    player: IPlayerDoc;
    playerDefence: number;
    monster: IMonster;
    events: string[];
    turnNumber: number;
    eventNumber: number;
    hasFled: boolean;

    constructor(player: IPlayerDoc) {
        this.player = player;
        this.playerDefence = PlayerDefense.defending;
        this.monster = {
            name: choose(['Goblin', 'Mantis', 'Serpent', 'Tarantula']),
            health: INITIAL_MONSTER_HEALTH,
            strikeProbability: INITIAL_STRIKE_PROBABILITY
        };
        this.turnNumber = 1;
        this.eventNumber = 1;
        this.events = [];
        this.addEvent('Fight Started');
        this.hasFled = false;
    }

    addEvent(event: string) {
        this.events.push(`${this.turnNumber}:${this.eventNumber} - ${event}`);
        this.eventNumber += 1;

        while (this.events.length > MAX_EVENTS_LENGTH) {
            this.events.shift();
        }
    }

    anyTurn() {
        this.monster.strikeProbability *= 2;

        const monsterAttacks = takeChance(this.monster.strikeProbability);
        if (monsterAttacks && this.monster.health > 0) {
            this.monster.strikeProbability = INITIAL_STRIKE_PROBABILITY;
            const damage = (ATTACK_DAMAGE - this.playerDefence);
            this.player.health -= damage;
            this.addEvent(`Monster Attacks doing ${damage} damage`)
        }

        this.turnNumber += 1;
        this.eventNumber = 1;
    }

    attack() {
        this.playerDefence = PlayerDefense.attacking;
        const damage = (ATTACK_DAMAGE + Math.ceil(this.monster.strikeProbability * 10));
        this.monster.health -= damage;
        this.addEvent(`Player Attacks doing ${damage} damage`);
        this.anyTurn();
    }

    defend() {
        this.addEvent('Player Defends');
        this.playerDefence = PlayerDefense.defending;
        this.anyTurn();
    }

    flee() {
        this.addEvent('Player Flees');
        this.hasFled = true;
        this.anyTurn();
    }

    getOutcome(): FightStatus {
        if (this.player.health <= 0) {
            this.addEvent(`Monster Kills ${this.player.name}, Player Respawns with ${PLAYER_RESPAWN_HEALTH} HP`);
            this.player.health = PLAYER_RESPAWN_HEALTH; // Reset to a low amount (respawn)
            return FightStatus.PlayerWon;
        } else if (this.monster.health <= 0) {
            this.monster.health = 0;
            const xp = (10 * this.turnNumber);
            this.player.xp += xp;
            this.addEvent(`${this.player.name} Kills Monster gaining ${xp} XP`);
            return FightStatus.MonsterWon;
        } else if (this.hasFled) {
            return FightStatus.PlayerFlee;
        }

        return FightStatus.Running;
    }
}