import { IPlayerDoc } from "../../db/model/player";
import { choose, takeChance } from "../../utils";
import { MessageEmbed } from "discord.js";

export const Emoji = {
    controller: '🎮',
    heart: '❤️',
    crossedSwords: '⚔️',
    shield: '🛡️',
    flee: '🏃‍♂️',
    j: '🇯'
}

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
    players: IPlayerDoc[];
    playerDefence: number; // TODO: Remove this by generating defense at runtime based off stats
    monster: IMonster;
    events: string[];
    turnNumber: number;
    eventNumber: number;
    hasFled: boolean;
    waitingFor: string[]

    constructor(player: IPlayerDoc) {
        this.players = [player];
        this.waitingFor = [player._id]
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

            const player = choose(this.players)
            const damage = (ATTACK_DAMAGE - this.playerDefence);
            player.health -= damage

            this.addEvent(`Monster attacks ${player.name} doing ${damage} damage`)
        }

        this.waitingFor = this.players.map(player => player._id)

        this.turnNumber += 1;
        this.eventNumber = 1;
    }

    attack(player: IPlayerDoc) {
        if (this.playerJoined(player) && this.waitingFor.includes(player._id)) {
            const idx = this.waitingFor.indexOf(player._id)
            this.waitingFor.splice(idx, 1)

            this.playerDefence = PlayerDefense.attacking;
            const damage = (ATTACK_DAMAGE + Math.ceil(this.monster.strikeProbability * 10));
            this.monster.health -= damage;
            this.addEvent(`${player.name} Attacks doing ${damage} damage. Waiting For ${this.waitingFor.length} Players`);

            if (this.waitingFor.length === 0) {
                this.anyTurn();
            }
        }
    }

    defend(player: IPlayerDoc) {
        if (this.playerJoined(player) && this.waitingFor.includes(player._id)) {
            const idx = this.waitingFor.indexOf(player._id)
            this.waitingFor.splice(idx, 1)

            this.addEvent(`${player.name} Defends. Waiting For ${this.waitingFor.length} Players`);
            this.playerDefence = PlayerDefense.defending;


            if (this.waitingFor.length === 0) {
                this.anyTurn();
            }
        }
    }

    flee(player: IPlayerDoc) {
        this.removePlayer(player)

        const idx = this.waitingFor.indexOf(player._id)
        this.waitingFor.splice(idx, 1)

        this.addEvent(`${player.name} Flees. Waiting For ${this.waitingFor.length} Players`);

        if (this.waitingFor.length === 0) {
            this.anyTurn();
        }
    }

    join(player: IPlayerDoc) {
        if (!this.playerJoined(player)) {
            this.players.push(player)
            this.addEvent(`${player.name} has joined the battle`)
            this.waitingFor.push(player._id)
        }
    }


    getOutcome(): FightStatus {
        const alivePlayers = this.players.filter(player => player.health > 0)

        if (alivePlayers.length === 0) {
            this.addEvent(`Monster has won by killing all players, Player Respawns with ${PLAYER_RESPAWN_HEALTH} HP`);
            this.players.forEach(player => player.health = PLAYER_RESPAWN_HEALTH);
            this.players.forEach(p => p.fightsLost = p.fightsLost ? p.fightsLost + 1 : 1)
            return FightStatus.MonsterWon;
        } else if (this.monster.health <= 0) {
            this.monster.health = 0;
            const xp = (10 * this.turnNumber);
            this.players.forEach(player => player.xp += xp);
            this.addEvent(`The Players have Killed the Monster gaining ${xp} XP each`);
            this.players.forEach(p => p.fightsWon = p.fightsWon ? p.fightsWon + 1 : 1)
            return FightStatus.PlayerWon;
        } else if (this.hasFled) {
            return FightStatus.PlayerFlee;
        }

        return FightStatus.Running;
    }

    playerJoined(player: IPlayerDoc): boolean {
        return this.players.filter(p => p._id === player._id).length !== 0
    }

    removePlayer(player: IPlayerDoc) {
        this.players.forEach((p, i) => {
            if (p._id === player._id) {
                this.players.splice(i, 1)
            }
        })
    }

    createFightEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Fight} :crossed_swords:`)
            .setDescription(`Fighting a ${this.monster.name}`)

        this.players.forEach(player => {
            embed.addField(player.name, `${Emoji.heart}:${player.health}, ${Emoji.controller}: ${player.xp}`)
        })

        embed.addField(this.monster.name, `${Emoji.heart}: ${this.monster.health}, ${Emoji.crossedSwords}: ${this.monster.strikeProbability * 100}%`)
            .addField('Events', this.events.join('\n'))
            .setTimestamp();

        return embed
    }
}